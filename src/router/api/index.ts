import { Router } from 'express';
import signInRouter from '../signin';
import patientQuestionnaireRouter from '../patient-questionnaire';

const router = Router();

router.use(signInRouter, patientQuestionnaireRouter);

export default router;
