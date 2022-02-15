import {
  Server,
  ServerCredentials
} from "@grpc/grpc-js";

import { 
  TokenAuthService, 
  TokenAuthServer 
} from "./grpc/service";

const host = "0.0.0.0";
const port = process.env.GRPC_PORT || 7500;
const address = `${host}:${port}`;

const getServer = (): Server => {
  const server = new Server();
  server.addService(
    TokenAuthService,
    new TokenAuthServer(),
  );
  return server;
};

const routeServer = getServer();
routeServer.bindAsync(address, ServerCredentials.createInsecure(), () => {
  routeServer.start();
  console.log(`Server running at ${address}`);
});

function exitHandler() {
  routeServer.forceShutdown();
}

process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));