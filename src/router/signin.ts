import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { SignInSchema } from '../schema/signin';
import * as authServ from '../service/auth';
import * as tokenServ from '../service/token';

const router = Router();
const validator = new Validator({ allErrors: true });

interface SignInResponseBody {
  bearerToken: string;
}

router.post(
  '/signin',
  validator.validate({ body: SignInSchema }),
  async (req: Request, res: Response): Promise<void> => {
    const { userId, password } = req.body;
    if (!(await authServ.authenticate(userId, password))) {
      res.sendStatus(403);
      return;
    }
    const token: string | undefined = await tokenServ.generateAccessToken(userId);
    if (!token) {
      res.sendStatus(403);
      return;
    }
    const respBody: SignInResponseBody = { bearerToken: token };
    res.json(respBody);
  }
);

export default router;
