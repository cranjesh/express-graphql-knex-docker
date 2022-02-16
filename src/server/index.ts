import express, { json, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import unless from 'express-unless';
import jwt from 'express-jwt';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import helmet from 'helmet';

declare global {
  namespace Express {
    interface Request {
      authtoken: string;
    }
  }
}

import apiRouter from '../router/api';
import { JWT_HMAC_ALG, JWT_SECRET } from '../config';
import {
  getJwtFromRequest,
  sendErrResponse,
  schemaValidationError,
  unhandledErrors
} from '../middleware';
import * as tokenServ from '../service/token';
import { TokenAuthApiClient } from '../grpc/client';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
class Server {
  private app;

  constructor() {
    this.app = express();
    this.authMiddleware();
    this.configMiddleware();
    this.routerMiddleware();
    this.errorHandlerMiddleware();
    this.apiDocMiddleware();
  }

  //TODO: Allow setting hostname from config (environment variable)
  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`*** Euc quiz server running at ${port} ***`);
    });
  }

  private configMiddleware() {
    const logger = morgan('dev');
    this.app.use(logger);
    this.app.use(json());
    this.app.use(cors());
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    this.app.use(bodyParser.json({ limit: '1mb' }));
    // only apply to requests that begin with /api/
    this.app.use('/api/', apiLimiter);
    this.app.use(helmet());
  }

  private authMiddleware() {
    // Do not require user auth JWT on these routes
    const skipAuthOn: unless.Options = {
      path: [
        { methods: ['GET'], url: '/' },
        { methods: ['GET'], url: /^\/api-docs/ },
        { methods: ['POST'], url: '/api/signin' }
      ]
    };

    const jwtOptions = {
      secret: JWT_SECRET,
      algorithms: [JWT_HMAC_ALG],
      getToken: getJwtFromRequest
    };

    // Verify user auth JWT and only continue if valid
    this.app.use(
      jwt(jwtOptions).unless(skipAuthOn),
      async (err: Error, req: Request, res: Response, next: NextFunction) => {
        // gRPC microservice client
        const client: TokenAuthApiClient = new TokenAuthApiClient('0.0.0.0:7500');
        try {
          const valid: boolean = await client.verifyAccessToken(req.authtoken);
          if (!valid) {
            sendErrResponse(res, 401, `Unauthorized`);
            return;
          }
        } catch (err) {
          const valid: boolean = await tokenServ.verifyAccessToken(req.authtoken);
          if (!valid) {
            sendErrResponse(res, 401, `Unauthorized`);
            return;
          }
        }
        next();
      }
    );

    this.app.use(
      jwt({
        ...jwtOptions,
        credentialsRequired: false
      }).unless((req) => req !== undefined)
    );
  }

  private routerMiddleware() {
    this.app.use('/api', apiRouter);
    this.app.get(/^\/$/, (_req, res) => res.send('Euc quiz server is up')); // For testing - Check server is up
  }

  private errorHandlerMiddleware() {
    this.app.use(schemaValidationError);
    this.app.use(unhandledErrors);
  }

  private apiDocMiddleware() {
    const swaggerFile: any = join(__dirname, '../../swagger.json');
    const swaggerData: any = readFileSync(swaggerFile, 'utf8');
    const swaggerDoc = JSON.parse(swaggerData);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  }
}

export default Server;
