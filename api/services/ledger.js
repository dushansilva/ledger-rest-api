const { Interval } = require('luxon');
const { round } = require('lodash');
const { FREQUENCY_TYPES } = require('../constants/ledger');
const { ledgerInputValidation } = require('./validation');
const { handleError } = require('./utility');

const calculateWeeklyAmount = (weeklyAmount) => round(weeklyAmount, 2);

const calculateFortnightlyAmount = (weeklyAmount) => round(weeklyAmount * 2, 2);

const calculateMonthlyAmount = (weeklyAmount) => {
  const daily = weeklyAmount / 7;
  const yearly = daily * 365;
  const monthly = yearly / 12;
  return round(monthly, 2);
};

const calculateRemainder = (weeklyAmount, remainingDays) => {
  const dailyAmount = weeklyAmount / 7;
  return round(remainingDays * dailyAmount, 2);
};

/**
 * This is used to calculate the weekly and forthnightly line items
 * @param {luxonDate} startDate - starting date
 * @param {luxonDate} endDate - ending date
 * @param {string} frequency - frequency as WEELKLY
 * @param {int} weeklyRent - weekly rent amount
 * @returns {array}
 */
exports.handleFortnightlyWeekly = (startDate, endDate, weeklyRent, frequency) => {
  const result = ledgerInputValidation({
    startDate, endDate, frequency, weeklyRent,
  });

  if (!result.isValid || frequency === FREQUENCY_TYPES.MONTHLY) {
    throw handleError('Invalid ledger input');
  }

  let days = 14;
  let amount = calculateFortnightlyAmount(weeklyRent);
  if (frequency === FREQUENCY_TYPES.WEEKLY) {
    days = 7;
    amount = calculateWeeklyAmount(weeklyRent);
  }
  const intervals = round(Interval.fromDateTimes(startDate, endDate).length('days'));
  const remainingDays = intervals % days;
  const noOfFullPayments = (intervals - remainingDays) / days;
  const array = [];

  let nextStart = startDate;
  for (let index = 1; index <= noOfFullPayments; index += 1) {
    const paymentStart = nextStart;
    const paymentEnd = paymentStart.plus({ days: days - 1 });
    nextStart = paymentEnd.plus({ days: 1 });
    const payment = {
      startDate: paymentStart.toISO(),
      endDate: paymentEnd.toISO(),
      amount,
    };
    array.push(payment);
  }
  if (remainingDays > 0) {
    const remainingAmount = {
      startDate: nextStart.toISO(),
      endDate: endDate.toISO(),
      amount: calculateRemainder(weeklyRent, remainingDays + 1),
    };
    array.push(remainingAmount);
  }
  return array;
};

/**
 * This is used to calculate the monthly line items
 * @param {luxonDate} startDate - starting date
 * @param {luxonDate} endDate - ending date
 * @param {int} weeklyRent - weekly rent amount
 * @returns {array}
 */
exports.handleMonthly = (startDate, endDate, weeklyRent) => {
  const result = ledgerInputValidation({
    startDate, endDate, frequency: FREQUENCY_TYPES.MONTHLY, weeklyRent,
  });

  if (!result.isValid) {
    throw handleError('Invalid ledger input');
  }
  const intervals = Interval.fromDateTimes(startDate, endDate).toDuration(['months', 'days']);
  const remainingDays = round(intervals.days);
  const noOfFullPayments = intervals.months;
  const amount = calculateMonthlyAmount(weeklyRent);
  const array = [];

  let nextStart = startDate;
  for (let index = 1; index <= noOfFullPayments; index += 1) {
    const paymentStart = nextStart;

    let paymentEnd = paymentStart.plus({ months: 1 });
    nextStart = paymentEnd.plus({ days: 1 });
    if (index !== 1 && startDate.day === 31 && paymentEnd.day !== 31) {
      if (paymentStart.daysInMonth === 31) {
        paymentEnd = paymentStart.set({ day: 31 });
        nextStart = paymentEnd.plus({ days: 1 });
      }
    }
    const payment = {
      startDate: paymentStart.toISO(),
      endDate: paymentEnd.toISO(),
      amount,
    };
    array.push(payment);
  }
  if (remainingDays > 0) {
    const remainingAmount = {
      startDate: nextStart.toISO(),
      endDate: endDate.toISO(),
      amount: calculateRemainder(weeklyRent, remainingDays + 1),
    };
    array.push(remainingAmount);
  }
  return array;
};
