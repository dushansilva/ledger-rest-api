const { handleValidationResponse, handleErrorResponse } = require('../services/response-utily');
const { handleLedgerReqValidation } = require('../services/validation');

exports.validateLedger = (req, res, next) => {
  try {
    const {
      start_date: startDate, end_date: endDate, frequency,
      weekly_rent: weeklyRent, time_zone: timeZone,
    } = req.query;
    const requestData = {
      startDate,
      endDate,
      timeZone,
      weeklyRent,
      frequency,
    };
    const result = handleLedgerReqValidation(requestData);
    if (!result.isValid) {
      handleValidationResponse(res, 400, result.details);
    } else {
      next();
    }
  } catch (error) {
    handleErrorResponse(res, 500, error);
  }
};
