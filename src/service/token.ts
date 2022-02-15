import * as jwt from 'jsonwebtoken';
import { JWT_HMAC_ALG, JWT_SECRET, JWT_EXPIRES } from '../config';

const jwtSign = async (
  userId: string,
  signingKey: string,
  expiresIn: string
): Promise<string | undefined> => {
  return await new Promise((resolve, reject) => {
    jwt.sign(
      { userId, access: 'all' },
      signingKey,
      {
        expiresIn,
        algorithm: JWT_HMAC_ALG
      },
      (err: Error | null, encoded: string | undefined) => {
        if (err != null) reject(err);
        resolve(encoded);
      }
    );
  });
};

export const generateAccessToken = async (userId: string): Promise<string | undefined> =>
  await jwtSign(userId, JWT_SECRET, JWT_EXPIRES);

const jwtVerify = async (
  token: string,
  signingKey: string
): Promise<jwt.JwtPayload | undefined> => {
  return await new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signingKey,
      (err: jwt.VerifyErrors | null, data: jwt.JwtPayload | undefined) => {
        if (err != null) reject(err);
        resolve(data);
      }
    );
  });
};

export const verifyAccessToken = async (token: string | undefined): Promise<boolean> => {
  if (!token) return false;
  try {
    const decoded: jwt.JwtPayload | undefined = await jwtVerify(token, JWT_SECRET);
    return !(decoded == null);
  } catch (err) {
    return false;
  }
};
