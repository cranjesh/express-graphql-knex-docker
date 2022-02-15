import { JSONSchema7 } from 'json-schema';

export const SignInSchema: JSONSchema7 = {
  type: 'object',
  required: ['userId', 'password'],
  properties: {
    userId: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  }
};
