import { ChannelCredentials } from '@grpc/grpc-js';

import { VerifyReq, VerifyResp } from '../stub/token_auth_pb';
import { TokenAuthClient } from '../stub/token_auth_grpc_pb';

export class TokenAuthApiClient {
  client: TokenAuthClient;

  constructor(url: string) {
    this.client = new TokenAuthClient(url, ChannelCredentials.createInsecure());
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    console.log('gRPC TokenAuthApiClient verifyAccessToken invoked');
    const req: VerifyReq = new VerifyReq();
    req.setToken(token);

    return new Promise((resolve, reject) => {
      this.client.verifyAccessToken(req, (err: any, resp: VerifyResp) => {
        if (err)
          reject(err);
        else 
          resolve(resp.getResult());
      });
    });
  }
}
