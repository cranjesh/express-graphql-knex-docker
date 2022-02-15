import Server from './server';
import { APP_PORT } from './config';

const server = new Server();

server.start(APP_PORT);
