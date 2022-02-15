import * as fs from 'fs';
import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { APP_PORT } from './config';
import { signInResolvers } from './graphql/signin'
import { questionnaireResolvers } from './graphql/patientQuestionnaire';

const env = process.env.NODE_ENV || 'local';
const typeDefs = fs.readFileSync(path.join(__dirname, "/graphql/schema.graphql"), "utf8").toString()

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: { ...signInResolvers, ...questionnaireResolvers },
  formatError: (err) => {
    console.error(err);
    console.error('err.message', err.message);
    // show errors on local env
    if(env === 'local')
      return err;
    // https://www.apollographql.com/docs/apollo-server/data/errors/
    // Don't give the specific errors to the client.
    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    // Database errors
    if (err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      if(err.extensions?.exception?.code?.includes('CONSTRAINT'))
        return new Error('Input error');
      else
        return new Error('Internal server error');
    }
    // Auth errors
    // TODO
    return err;
  },
});

//express server
const app = express();
async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();

app.listen(APP_PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${APP_PORT}`);
});
