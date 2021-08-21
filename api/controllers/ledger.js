const { FREQUENCY_TYPES } = require('../constants/ledger');
const { handleError } = require('../services/utility');
const { handleForthnighltyWeekly, handleMonthly } = require('../services/ledger');

exports.calculateLineItemAmount = (startDate, endDate, frequency, weeklyAmount) => {
  switch (frequency) {
    case FREQUENCY_TYPES.WEEKLY:
      return handleForthnighltyWeekly(startDate, endDate, weeklyAmount, frequency);
    case FREQUENCY_TYPES.FORTNIGHTLY:
      return handleForthnighltyWeekly(startDate, endDate, weeklyAmount, frequency);
    case FREQUENCY_TYPES.MONTHLY:
      return handleMonthly(startDate, endDate, weeklyAmount);
    default:
      throw handleError('Invalid frequency type');
  }
};
