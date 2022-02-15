import * as tokenServ from './token';

describe('Token Service', () => {
  it('should generate access token and it should be valid on verification', async () => {
    const userId = 'euc';
    const token: string | undefined = await tokenServ.generateAccessToken(userId);
    // console.log('token==>', token);
    const valid = await tokenServ.verifyAccessToken(token);
    // console.log('valid==>', valid);
    expect(valid).toBeTruthy();
  });
  it('should validate access token', async () => {
    const valid = await tokenServ.verifyAccessToken('random');
   // console.log('valid==>', valid);
    expect(valid).toBeFalsy();
  });
});
