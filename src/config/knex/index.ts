import { Knex, knex } from 'knex';
import { join } from 'path';

interface KnexEnvConfig {
  local: Knex.Config;
  staging: Knex.Config;
}

const local: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: join(__dirname, '../../../db/questionnaire.db')
  },
  useNullAsDefault: true
};

const staging: Knex.Config = {
  client: 'postgresql',
  connection: {
    database: 'quiz_staging',
    user: 'username',
    password: 'password'
  },
  pool: {
    min: 1,
    max: 4
  }
};

const knexConfig: KnexEnvConfig = {
  local,
  staging
};
const env = process.env.NODE_ENV || 'local';

export const buildKnexInstance = (): Knex => {
  console.info(`*** Knex Instance intialised with env [${env}] ***`);
  if (env === 'staging') return knex(knexConfig.staging);
  return knex(knexConfig.local);
};

export const destroyKnexInstance = async(knexInstance:Knex) => knexInstance.destroy();
