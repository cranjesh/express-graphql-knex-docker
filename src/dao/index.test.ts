import * as dao from './index';
import {buildKnexInstance, destroyKnexInstance} from '../config/knex';
import { Knex } from 'knex';

describe('Table questionnaire_question', () => {
  it('should get all rows from table', async () => {
    const knexInstance: Knex = buildKnexInstance();
    const noOfRows = 6;
    const questions = await dao.getQuestions(knexInstance);
    await destroyKnexInstance(knexInstance);
    expect(questions).toHaveLength(noOfRows);
  });
});

describe('Table questionnaire_answer', () => {
  it('should get all rows from table', async () => {
    const noOfRows = 25;
    const knexInstance: Knex = buildKnexInstance();
    const answers = await dao.getAnswers(knexInstance);
    await destroyKnexInstance(knexInstance);
    expect(answers).toHaveLength(noOfRows);
  });
});

describe('Table patient_questionnaire', () => {
  it('should get all rows from table', async () => {
    const noOfRows = 5;
    const knexInstance: Knex = buildKnexInstance();
    const questionnaires = await dao.getPatientQuestionnaires(knexInstance);
    await destroyKnexInstance(knexInstance);
    expect(questionnaires).toHaveLength(noOfRows);
  });
});

describe('getPatientLatestQuestionnaire', () => {
  let knexInstance: Knex = buildKnexInstance();
  beforeAll(() => {
    knexInstance = buildKnexInstance();
  });
  it('should get correct data for patient id 1', async () => {
    const patientId = 1;
    const noOfRows = 5;
    const latestQuestionaireAnsArr: dao.LatestPatientQuestionnaire[] =
      await dao.getPatientLatestQuestionnaire(knexInstance, patientId);
    expect(latestQuestionaireAnsArr).toHaveLength(noOfRows);
  });
  it('should get correct data for patient id 2', async () => {
    const patientId = 2;
    const noOfRows = 5;
    const latestQuestionaireAnsArr: dao.LatestPatientQuestionnaire[] =
      await dao.getPatientLatestQuestionnaire(knexInstance, patientId);
    expect(latestQuestionaireAnsArr).toHaveLength(noOfRows);
  });
  it('should get correct data for invalid patient id', async () => {
    const invalidPatientId = 84503;
    const noOfRows = 0;
    const latestQuestionaireAnsArr: dao.LatestPatientQuestionnaire[] =
      await dao.getPatientLatestQuestionnaire(knexInstance, invalidPatientId);
    expect(latestQuestionaireAnsArr).toHaveLength(noOfRows);
  });
  afterAll(async() => {
    await destroyKnexInstance(knexInstance);
  });
});
