import * as authServ from '../service/auth';
import * as tokenServ from '../service/token';

import {
  MutationSignInArgs,
  SignInResponse,
} from './graphql-types';

export const signInResolvers = {
  Mutation: {
    async signIn(_: any, {userId, password}: MutationSignInArgs) {
      if (!(await authServ.authenticate(userId, password)))
        return;
      const token: string | undefined = await tokenServ.generateAccessToken(userId);
      if (!token)
        return;
      const respBody: SignInResponse = { bearerToken: token };
      return respBody;
    }
  },
};