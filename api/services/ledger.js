const { Interval } = require('luxon');
const { round } = require('lodash');
const { FREQUENCY_TYPES } = require('../constants/ledger');

const calculateWeeklyAmount = (weeklyAmount) => weeklyAmount;

const calculateFortnightlyAmount = (weeklyAmount) => weeklyAmount * 2;

const calculateMonthlyAmount = (weeklyAmount) => {
  const daily = weeklyAmount / 7;
  const yearly = daily * 365;
  const monthly = yearly / 12;
  return monthly;
};

const calculateRemainder = (weeklyAmount, remainingDays) => {
  const dailyAmount = round(weeklyAmount / 7, 3);
  return remainingDays * dailyAmount;
};

exports.handleForthnighltyWeekly = (startDate, endDate, weeklyAmount, frequency) => {
  let days = 14;
  let amount = calculateFortnightlyAmount(weeklyAmount);
  if (frequency === FREQUENCY_TYPES.WEEKLY) {
    days = 7;
    amount = calculateWeeklyAmount(weeklyAmount);
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
      startDate: paymentStart.toISODate(),
      endDate: paymentEnd.toISODate(),
      amount,
    };
    array.push(payment);
  }
  if (remainingDays > 0) {
    const remainingAmount = {
      startDate: nextStart.toISODate(),
      endDate: endDate.toISODate(),
      amount: calculateRemainder(weeklyAmount, remainingDays + 1),
    };
    array.push(remainingAmount);
  }
  return array;
};

exports.handleMonthly = (startDate, endDate, weeklyAmount) => {
  const intervals = Interval.fromDateTimes(startDate, endDate).toDuration(['months', 'days']);
  const remainingDays = round(intervals.days);
  const noOfFullPayments = intervals.months;
  const amount = calculateMonthlyAmount(weeklyAmount);
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
      startDate: paymentStart.toISODate(),
      endDate: paymentEnd.toISODate(),
      amount,
    };
    array.push(payment);
  }
  if (remainingDays > 0) {
    const remainingAmount = {
      startDate: nextStart.toISODate(),
      endDate: endDate.toISODate(),
      amount: calculateRemainder(weeklyAmount, remainingDays + 1),
    };
    array.push(remainingAmount);
  }
  return array;
};
