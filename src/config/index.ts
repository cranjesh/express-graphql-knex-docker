const ENV_JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_SECRET =
  ENV_JWT_SECRET ||
  '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';
export const APP_PORT = parseInt(process.env.APP_PORT || '8500');
export const GRAPHQL_PORT = parseInt(process.env.GRAPHQL_PORT || '9500');

export const JWT_HMAC_ALG = 'HS256';
const ENV_JWT_EXPIRES = process.env.JWT_EXPIRES as string;
export const JWT_EXPIRES = ENV_JWT_EXPIRES || '900s';
