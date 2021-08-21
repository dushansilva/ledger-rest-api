const { FREQUENCY_TYPES } = require('../constants/ledger');
const { handleError } = require('../services/utility');
const { handleFortnightlyWeekly, handleMonthly } = require('../services/ledger');
const { ledgerInputValidation } = require('../services/validation');

exports.calculateLineItemAmount = (startDate, endDate, frequency, weeklyAmount) => {
  switch (frequency) {
    case FREQUENCY_TYPES.WEEKLY:
      return handleFortnightlyWeekly(startDate, endDate, weeklyAmount, frequency);
    case FREQUENCY_TYPES.FORTNIGHTLY:
      return handleFortnightlyWeekly(startDate, endDate, weeklyAmount, frequency);
    case FREQUENCY_TYPES.MONTHLY:
      return handleMonthly(startDate, endDate, weeklyAmount);
    default:
      throw handleError('Invalid frequency type');
  }
};
