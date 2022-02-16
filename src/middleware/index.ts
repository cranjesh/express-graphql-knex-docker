import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';

export type HttpErrorCode = 401 | 403 | 404 | 422 | 500;

export const getJwtFromRequest = (request: Request): string | undefined => {
  const auth: string | undefined = request.headers.authorization;
  if (!auth) return;
  const authSplit = auth.split(' ');
  if (authSplit.length != 2 || authSplit[0] != 'Bearer') return;
  request.authtoken = authSplit[1];
  return;
};

// Send an error response in standard format.
interface ErrResponseBody {
  errors: unknown;
}

export const sendErrResponse = (res: Response, code: HttpErrorCode, detail: unknown): void => {
  console.error(`Error ${code}: ${JSON.stringify(detail, undefined, 2)}`);
  const body: ErrResponseBody = { errors: detail };
  res.status(code).send(body);
};

export function schemaValidationError(
  err: ValidationError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.name === 'JsonSchemaValidationError') {
    sendErrResponse(res, 422, err.validationErrors);
  }
  next();
}

//FIXME: Don't think this is actually catching errors. Likely because async function errors
//       are not automatically caught by express. (This will change in express 5.x.x)
export function unhandledErrors(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err) {
    sendErrResponse(res, 500, `Internal server error ${err.name}: ${err.message}`);
  }
  next();
}
