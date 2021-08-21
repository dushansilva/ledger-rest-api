const { DateTime } = require('luxon');
const { handleFortnightlyWeekly, handleMonthly } = require('../../api/services/ledger');
const { ledgerInputValidation } = require('../../api/services/validation');

describe('Test ledger validations', () => {
  const startDate = '2021-04-02T15:00:00.000Z';
  const endDate = '2021-04-20T17:00:00.000Z';
  const frequency = 'FORTNIGHTLY';
  const weeklyRent = 500;
  const timeZone = 'America/Los_Angeles';
  const startDateF = DateTime.fromISO(startDate).setZone(timeZone);
  const endDateF = DateTime.fromISO(endDate).setZone(timeZone);

  test('Check validations working case', () => {
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: endDateF, frequency, weeklyRent,
    }).isValid)
      .toBeTruthy();
  });

  test('Check start date validation', () => {
    const stDate = new Date('2021-04-02T15:00:00.000Z');
    expect(ledgerInputValidation({
      startDate: stDate, endDateF, frequency, weeklyRent,
    }).isValid)
      .toBeFalsy();
  });
  test('Check end date validation', () => {
    const edDate = endDateF.minus({ months: 2 });
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: edDate, frequency, weeklyRent,
    })
      .isValid)
      .toBeFalsy();
  });

  test('Check frequency validation', () => {
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: endDateF, frequency: 'WRONG_FREQUENCY', weeklyRent,
    }).isValid)
      .toBeFalsy();
  });

  test('Check amount format validation', () => {
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: endDateF, frequency, weeklyRent: 'num',
    }).isValid)
      .toBeFalsy();
  });

  test('Check amount negative validation', () => {
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: endDateF, frequency, weeklyRent: -1,
    }).isValid)
      .toBeFalsy();
  });

  test('Check amount zero validation', () => {
    expect(ledgerInputValidation({
      startDate: startDateF, endDate: endDateF, frequency, weeklyRent: 0,
    }).isValid)
      .toBeFalsy();
  });
});

describe('Test Forthnighly & weekly calculations', () => {
  const startDate = '2021-04-02T15:00:00.000Z';
  const endDate = '2021-04-20T17:00:00.000Z';
  const frequency = 'FORTNIGHTLY';
  const amount = 500;
  const timeZone = 'America/Los_Angeles';
  const startDateF = DateTime.fromISO(startDate).setZone(timeZone);
  const endDateF = DateTime.fromISO(endDate).setZone(timeZone);
  const output = handleFortnightlyWeekly(startDateF, endDateF, amount, frequency);

  const expected = [
    {
      startDate: '2021-04-02T08:00:00.000-07:00',
      endDate: '2021-04-15T08:00:00.000-07:00',
      amount: 1000,
    },
    {
      startDate: '2021-04-16T08:00:00.000-07:00',
      endDate: '2021-04-20T10:00:00.000-07:00',
      amount: 357.14,
    },
  ];
  test('Check Forthnighly normal case ', () => {
    expect(output).not.toEqual(null);
    expect(output).toEqual(expected);
  });

  const expected2 = [
    {
      startDate: '2021-04-02T08:00:00.000-07:00',
      endDate: '2021-04-08T08:00:00.000-07:00',
      amount: 500,
    },
    {
      startDate: '2021-04-09T08:00:00.000-07:00',
      endDate: '2021-04-15T08:00:00.000-07:00',
      amount: 500,
    },
    {
      startDate: '2021-04-16T08:00:00.000-07:00',
      endDate: '2021-04-20T10:00:00.000-07:00',
      amount: 357.14,
    },
  ];

  const frequency2 = 'WEEKLY';
  const output2 = handleFortnightlyWeekly(startDateF, endDateF, amount, frequency2);
  test('Check Weekly normal case ', () => {
    expect(output2).not.toEqual(null);
    expect(output2).toEqual(expected2);
  });

  const startDate3 = '2021-04-10T15:00:00.000Z';
  const startDateF3 = DateTime.fromISO(startDate3).setZone(timeZone);
  const output3 = handleFortnightlyWeekly(startDateF3, endDateF, amount, frequency);
  const expected3 = [
    {
      startDate: '2021-04-10T08:00:00.000-07:00',
      endDate: '2021-04-20T10:00:00.000-07:00',
      amount: 785.71,
    },
  ];
  test('Check Forthnighly less than 14 days ', () => {
    expect(output3).not.toEqual(null);
    expect(output3).toEqual(expected3);
  });

  const startDate4 = '2021-04-18T15:00:00.000Z';
  const startDateF4 = DateTime.fromISO(startDate4).setZone(timeZone);
  const output4 = handleFortnightlyWeekly(startDateF4, endDateF, amount, frequency);
  const expected4 = [
    {
      startDate: '2021-04-18T08:00:00.000-07:00',
      endDate: '2021-04-20T10:00:00.000-07:00',
      amount: 214.29,
    },
  ];
  test('Check Weekly less than 7 days ', () => {
    expect(output4).not.toEqual(null);
    expect(output4).toEqual(expected4);
  });
});

describe('Test Monthly calculations', () => {
  const startDate = '2021-08-31T15:00:00.000Z';
  const endDate = '2021-11-20T17:00:00.000Z';
  const frequency = 'MONTHLY';
  const amount = 800;
  const timeZone = 'Europe/Istanbul';
  const startDateF = DateTime.fromISO(startDate).setZone(timeZone);
  const endDateF = DateTime.fromISO(endDate).setZone(timeZone);
  const output = handleMonthly(startDateF, endDateF, amount, frequency);
  const expected = [
    {
      startDate: '2021-08-31T18:00:00.000+03:00',
      endDate: '2021-09-30T18:00:00.000+03:00',
      amount: 3476.19,
    },
    {
      startDate: '2021-10-01T18:00:00.000+03:00',
      endDate: '2021-10-31T18:00:00.000+03:00',
      amount: 3476.19,
    },
    {
      startDate: '2021-11-01T18:00:00.000+03:00',
      endDate: '2021-11-20T20:00:00.000+03:00',
      amount: 2400,
    },
  ];

  test('Check Monthly case starting on 31st', () => {
    expect(output).not.toEqual(null);
    expect(output).toEqual(expected);
  });

  const startDate2 = '2021-10-15T15:00:00.000Z';
  const startDateF2 = DateTime.fromISO(startDate2).setZone(timeZone);
  const output2 = handleMonthly(startDateF2, endDateF, amount, frequency);
  const expected2 = [
    {
      startDate: '2021-10-15T18:00:00.000+03:00',
      endDate: '2021-11-15T18:00:00.000+03:00',
      amount: 3476.19,
    },
    {
      startDate: '2021-11-16T18:00:00.000+03:00',
      endDate: '2021-11-20T20:00:00.000+03:00',
      amount: 685.71,
    },
  ];
  test('Check Monthly normal case', () => {
    expect(output2).not.toEqual(null);
    expect(output2).toEqual(expected2);
  });

  const startDate3 = '2021-11-02T15:00:00.000Z';
  const startDateF3 = DateTime.fromISO(startDate3).setZone(timeZone);
  const output3 = handleMonthly(startDateF3, endDateF, amount, frequency);
  const expected3 = [
    {
      startDate: '2021-11-02T18:00:00.000+03:00',
      endDate: '2021-11-20T20:00:00.000+03:00',
      amount: 2171.43,
    },
  ];
  test('Check Monthly less than 30 days case', () => {
    expect(output3).not.toEqual(null);
    expect(output3).toEqual(expected3);
  });

  test('Check service method validation', () => {
    expect(() => {
      handleFortnightlyWeekly('test', endDateF, amount, frequency);
    }).toThrow('Invalid ledger input');
  });

  test('Check service method frequency validation', () => {
    expect(() => {
      handleFortnightlyWeekly(startDateF, endDateF, amount, 'MONTHLY');
    }).toThrow('Invalid ledger input');
  });

  test('Check service method validation', () => {
    expect(() => {
      handleMonthly(startDateF, endDateF, 'test');
    }).toThrow('Invalid ledger input');
  });
});
