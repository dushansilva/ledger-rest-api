const Joi = require('joi');
const { DateTime } = require('luxon');
const { FREQUENCY_TYPES } = require('../constants/ledger');

exports.handleLedgerReqValidation = (data) => {
  const schema = Joi.object({
    startDate: Joi.date().max('1-1-2100').iso(),
    endDate: Joi.date().max('1-1-2100').iso(),
    timeZone: Joi.custom((value) => {
      const { isValid } = DateTime.local().setZone(value);
      if (isValid) {
        return value;
      }
      throw new Error('Invalid time zone');
    }),
    weeklyRent: Joi.number().greater(0),
    frequency: Joi.custom((value) => {
      const isValid = Object.values(FREQUENCY_TYPES).includes(value);
      if (isValid) {
        return value;
      }
      throw new Error('Invalid frequency');
    }),
  });
  const result = schema.validate(data);
  if (result.error) {
    return { isValid: false, details: result };
  }
  return { isValid: true };
};
