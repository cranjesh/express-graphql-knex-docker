import * as quizServ from '../service/quiz';

import {
  QueryPatientQuestionnaireArgs,
  Questionnaire,
} from './graphql-types';

export const questionnaireResolvers = {
  Query: {
    async patientQuestionnaire(_: any, { patientId }: QueryPatientQuestionnaireArgs): Promise<Questionnaire> {
      const questionnaire: quizServ.Questionnaire | undefined =
        await quizServ.getPatientLatestQuestionnaire(patientId);
      // console.log('questionnaire ==> %j', questionnaire);
      return { questionnaireId: questionnaire?.questionnaireId, completedAt: questionnaire?.completedAt, questions: questionnaire?.questions };
    }
  }
};