import { JSONSchema7 } from 'json-schema';

export const PatientIdSchema: JSONSchema7 = {
  type: 'object',
  required: ['patientId'],
  properties: {
    patientId: {
      type: 'number'
    }
  }
};
