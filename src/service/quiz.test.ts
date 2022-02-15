import * as quizServ from './quiz';

describe('Table questionnaire_question', () => {
  it('should get all rows from table', async () => {
    const noOfRows = 6;
    const questions = await quizServ.getQuestions();
    expect(questions).toHaveLength(noOfRows);
  });
});

describe('getPatientLatestQuestionnaire', () => {
  it('should get correct data for patient id 1', async () => {
    const patientId = 1;
    const expectedQuestionnaire = {
      questionnaireId: 2,
      completedAt: '2021-06-04 03:00:00',
      questions: [
        {
          questionId: 2,
          question: 'What is your first name?',
          answer: 'John'
        },
        {
          questionId: 3,
          question: 'What is your last name?',
          answer: 'Smith'
        },
        {
          questionId: 4,
          question: 'Do you have any allergies?',
          answer: 'Eggs'
        },
        {
          questionId: 5,
          question: 'Do you currently take any medications?',
          answer: 'Prinivil'
        },
        {
          questionId: 6,
          question: 'When is your date of birth?',
          answer: '1990-01-01'
        }
      ]
    };
    const questionnaire: quizServ.Questionnaire | undefined =
      await quizServ.getPatientLatestQuestionnaire(patientId);
    expect(questionnaire).toEqual(expectedQuestionnaire);
  });
  it('should handle invalid patient id value', async () => {
    const patientId = -1393;
    const questionnaire: quizServ.Questionnaire | undefined =
      await quizServ.getPatientLatestQuestionnaire(patientId);
    expect(questionnaire).toBeUndefined();
  });
});
