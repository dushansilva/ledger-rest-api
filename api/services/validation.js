const Joi = require('joi');
const { DateTime } = require('luxon');
const { FREQUENCY_TYPES } = require('../constants/ledger');

/**
 * This is used in the validatidaton middlware
 * @param {object} data - object that contains startDate, endDate,
 *  weeklyRent,timezone and frequency
 * @returns {object}
 */
exports.handleLedgerReqValidation = (data) => {
  const { startDate, endDate } = data;
  const schema = Joi.object({
    startDate: Joi.date().max('1-1-2100').iso().required(),
    endDate: Joi.date().max('1-1-2100').iso().required()
      .custom(() => {
        const startDateF = DateTime.fromISO(startDate);
        const endDateF = DateTime.fromISO(endDate);
        const isValid = endDateF > startDateF;
        if (isValid) {
          return endDateF;
        }
        throw new Error('Start date greater than end date');
      }),
    timeZone: Joi.custom((value) => {
      const { isValid } = DateTime.local().setZone(value);
      if (isValid) {
        return value;
      }
      throw new Error('Invalid time zone');
    }).required(),
    weeklyRent: Joi.number().greater(0).required(),
    frequency: Joi.required().custom((value) => {
      const isValid = Object.values(FREQUENCY_TYPES).includes(value);
      if (isValid) {
        return value;
      }
      throw new Error('Invalid frequency');
    }),
  });

  const result = schema.validate(data);
  if (result.error) {
    return { isValid: false, details: result.error };
  }
  return { isValid: true };
};

/**
 * This is used to validate inputs for methods
 * @param {object} data - object that contains startDate, endDate, weeklyRent and frequency
 * @returns {object}
 */
exports.ledgerInputValidation = (data) => {
  const { startDate, endDate } = data;
  const schema = Joi.object({
    startDate: Joi.custom(() => {
      const startDateF = DateTime.fromISO(startDate);
      if (!startDateF.isValid) {
        throw new Error('Start date not valid');
      }
      const endDateF = DateTime.fromISO(endDate);
      if (!endDateF.isValid) {
        throw new Error('End date not valid');
      }
      return startDateF;
    }).required(),
    endDate: Joi.custom(() => {
      const startDateF = DateTime.fromISO(startDate);
      const endDateF = DateTime.fromISO(endDate);
      const isValid = endDateF > startDateF;
      if (isValid) {
        return endDateF;
      }
      throw new Error('Start date greater than end date');
    }).required(),
    weeklyRent: Joi.number().greater(0).required(),
    frequency: Joi.required().custom((value) => {
      const isValid = Object.values(FREQUENCY_TYPES).includes(value);
      if (isValid) {
        return value;
      }
      throw new Error('Invalid frequency');
    }),
  });

  const result = schema.validate(data);
  if (result.error) {
    console.error(result.error.message);
    return { isValid: false, details: result.error };
  }
  return { isValid: true };
};
