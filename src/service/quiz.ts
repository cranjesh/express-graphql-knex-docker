import { Knex } from 'knex';
import {buildKnexInstance, destroyKnexInstance} from '../config/knex';
import * as dao from '../dao';

export interface Question {
  questionId: number;
  question: string;
}

export interface QuestionAnswer {
  questionId: number;
  question: string;
  answer: string;
}

export interface Questionnaire {
  questionnaireId: number;
  completedAt: string;
  questions: QuestionAnswer[];
}

export const getQuestions = async (): Promise<Question[]> => {
  const knexInstance: Knex = buildKnexInstance();
  const questionsDao: dao.Question[] = await dao.getQuestions(knexInstance);
  await destroyKnexInstance(knexInstance);
  if (!questionsDao || questionsDao.length < 1) return [];
  const questionsServ: Question[] = questionsDao.map((quesAns) => {
    const { id, description }: dao.Question = quesAns;
    const question: Question = { questionId: id, question: description };
    return question;
  });
  return questionsServ;
};

export const getAnswers = async (): Promise<dao.Answer[]> => {
  const knexInstance: Knex = buildKnexInstance();
  const answers: dao.Answer[] = await dao.getAnswers(buildKnexInstance());
  await destroyKnexInstance(knexInstance);
  return answers;
};

export const getPatientQuestionnaires = async () => {
  const knexInstance: Knex = buildKnexInstance();
  const questionaire = await dao.getPatientQuestionnaires(buildKnexInstance());
  await destroyKnexInstance(knexInstance);
  return questionaire;
};

export const getPatientLatestQuestionnaire = async (
  patient_id: number
): Promise<Questionnaire | undefined> => {
  const knexInstance: Knex = buildKnexInstance();
  const latestQuestionaireAnsArr: dao.LatestPatientQuestionnaire[] =
    await dao.getPatientLatestQuestionnaire(knexInstance, patient_id);
  await destroyKnexInstance(knexInstance);
  if (!latestQuestionaireAnsArr || latestQuestionaireAnsArr.length < 1) return;
  const questionsServ: QuestionAnswer[] = latestQuestionaireAnsArr.map((quesAns) => {
    const { questionId, question, answer }: QuestionAnswer = quesAns;
    return { questionId, question, answer };
  });
  const questionnaire: Questionnaire = {
    questionnaireId: latestQuestionaireAnsArr[0].questionnaireId,
    completedAt: latestQuestionaireAnsArr[0].completedAt,
    questions: questionsServ
  };
  return questionnaire;
};
