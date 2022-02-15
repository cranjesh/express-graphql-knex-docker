import { Knex } from "knex";

export interface Question {
  id: number;
  description: string;
  short_code: string;
}

export interface Answer {
  id: number;
  questionnaire_id: number;
  question_id: number;
  answer: string;
}

export interface PatientQuestionnaire {
  id: number;
  patient_id: number;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

export const getQuestions = async (knexInstance:Knex) =>
  await knexInstance<Question>('questionnaire_question')
    .select('id')
    .select('description')
    .select('short_code');

export const getAnswers = async (knexInstance:Knex) =>
  await knexInstance<Answer>('questionnaire_answer')
    .select('id')
    .select('questionnaire_id')
    .select('question_id')
    .select('answer');

export const getPatientQuestionnaires = async (knexInstance:Knex) =>
  await knexInstance<PatientQuestionnaire>('patient_questionnaire')
    .select('id')
    .select('patient_id')
    .select('created_at')
    .select('updated_at')
    .select('completed_at');

export interface LatestPatientQuestionnaire {
  questionnaireId: number;
  completedAt: string;
  questionId: number;
  question: string;
  answer: string;
}

export const getPatientLatestQuestionnaire = async (
  knexInstance:Knex,
  patientId: number
): Promise<LatestPatientQuestionnaire[]> => {
  // This query was built using solutions from https://stackoverflow.com/questions/7745609/sql-select-only-rows-with-max-value-on-a-column
  const query = `SELECT R1.questionnaire_id questionnaireId, R1.completed_at completedAt, R2.question_id questionId, R2.description question, R2.answer
	FROM 
	(SELECT  A.questionnaire_id, A.completed_at
		FROM patient_questionnaire A
		INNER JOIN (
			SELECT patient_id, MAX(completed_at) completed_at
				FROM patient_questionnaire
				WHERE patient_id = ?
				GROUP BY patient_id
			) B ON A.patient_id = B.patient_id AND A.completed_at = B.completed_at
		) R1
		INNER JOIN (
			SELECT q_a. questionnaire_id, q_a. question_id, q_q.description, q_a.answer
				FROM questionnaire_answer q_a
				INNER JOIN questionnaire_question q_q
				ON q_a.question_id =  q_q.id
			) R2 ON R1.questionnaire_id = R2.questionnaire_id
        ORDER BY R2.question_id`;
  const results: LatestPatientQuestionnaire[] = await knexInstance.raw(query, [patientId]);
  return results;
};
