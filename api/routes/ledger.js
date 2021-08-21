const express = require('express');
const { DateTime } = require('luxon');

const { handleOkResponse, handleErrorResponse } = require('../services/response-utily');
const { calculateLineItemAmount } = require('../controllers/ledger');
const { validateLedger } = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const { generateJWT } = require('../services/utility');

const router = express.Router();

router.get('/', authenticate, validateLedger, (req, res) => {
  const {
    start_date: startDate, end_date: endDate, frequency,
    weekly_rent: weeklyRent, time_zone: timeZone,
  } = req.query;
  const startDateF = DateTime.fromISO(startDate).setZone(timeZone);
  const endDateF = DateTime.fromISO(endDate).setZone(timeZone);
  try {
    const responseBody = calculateLineItemAmount(startDateF, endDateF, frequency, weeklyRent);
    handleOkResponse(res, 200, responseBody);
  } catch (error) {
    handleErrorResponse(res, 500, error);
  }
});

router.post('/authenticate', (req, res) => {
  const token = generateJWT();
  try {
    const body = {
      token,
    };
    handleOkResponse(res, 200, body);
  } catch (error) {
    handleErrorResponse(res, 500, error);
  }
});
module.exports = router;
