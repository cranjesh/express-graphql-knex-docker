import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { PatientIdSchema } from '../schema/patientid';
import * as quizServ from '../service/quiz';

const router = Router();
const validator = new Validator({ allErrors: true });

interface PatientQuestionnaireResp {
  questionnaire: quizServ.Questionnaire;
}

router.get(
  '/patientquestionnaire',
  validator.validate({ body: PatientIdSchema }),
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.body;
    const questionnaire: quizServ.Questionnaire | undefined =
      await quizServ.getPatientLatestQuestionnaire(patientId);
    // console.log('questionnaire ==> %j', questionnaire);
    if (!questionnaire) {
      res.json({});
      return;
    }
    const body: PatientQuestionnaireResp = { questionnaire: questionnaire };
    res.json(body);
  }
);

export default router;
