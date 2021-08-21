const express = require('express');
const { DateTime } = require('luxon');
const { handleOkResponse, handleErrorResponse } = require('../services/response-utily');
const { calculateLineItemAmount } = require('../controllers/ledger');

const router = express.Router();

router.get('/', (req, res) => {
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

module.exports = router;
