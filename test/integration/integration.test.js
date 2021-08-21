const request = require('supertest');
const app = require('../../app');
const { generateJWT } = require('../../api/services/utility');

describe('Test ledger api', () => {
  const startDate = '2021-04-02T15:00:00.000Z';
  const endDate = '2021-04-20T17:00:00.000Z';
  const frequency = 'FORTNIGHTLY';
  const weeklyRent = 500;
  const timeZone = 'America/Los_Angeles';
  const requestBody = {
    start_date: startDate,
    end_date: endDate,
    frequency,
    weekly_rent: weeklyRent,
    time_zone: timeZone,
  };
  const token = generateJWT();
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
  test('Check api forthnightly normal case', async () => {
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected);
  });
  const requestBody2 = {
    start_date: startDate,
    end_date: endDate,
    frequency: 'WEEKLY',
    weekly_rent: weeklyRent,
    time_zone: timeZone,
  };

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
  test('Check api weekly normal case', async () => {
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody2);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected2);
  });

  const requestBody3 = {
    start_date: '2021-03-02T15:00:00.000Z',
    end_date: endDate,
    frequency: 'MONTHLY',
    weekly_rent: weeklyRent,
    time_zone: timeZone,
  };

  const expected3 = [
    {
      startDate: '2021-03-02T07:00:00.000-08:00',
      endDate: '2021-04-02T07:00:00.000-07:00',
      amount: 2172.62,
    },
    {
      startDate: '2021-04-03T07:00:00.000-07:00',
      endDate: '2021-04-20T10:00:00.000-07:00',
      amount: 1357.14,
    },
  ];
  test('Check api monthly normal case', async () => {
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody3);
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(expected3);
  });
});

describe('Test authentication', () => {
  const startDate = '2021-04-02T15:00:00.000Z';
  const endDate = '2021-04-20T17:00:00.000Z';
  const frequency = 'FORTNIGHTLY';
  const weeklyRent = 500;
  const timeZone = 'America/Los_Angeles';
  const requestBody = {
    start_date: startDate,
    end_date: endDate,
    frequency,
    weekly_rent: weeklyRent,
    time_zone: timeZone,
  };
  const token = '';
  test('Check ledger api authentication', async () => {
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(401);
  });
});

describe('Test ledger api validations', () => {
  const startDate = '2021-04-02T15:00:00.000Z';
  const endDate = '2021-04-20T17:00:00.000Z';
  const frequency = 'FORTNIGHTLY';
  const weeklyRent = 500;
  const timeZone = 'America/Los_Angeles';

  const token = generateJWT();
  test('Check api start date format', async () => {
    const requestBody = {
      start_date: '2020-1122',
      end_date: endDate,
      frequency,
      weekly_rent: weeklyRent,
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });
  test('Check api start date greater than end date', async () => {
    const requestBody = {
      start_date: '2022-04-02T15:00:00.000Z',
      end_date: endDate,
      frequency,
      weekly_rent: weeklyRent,
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });

  test('Check api frequency', async () => {
    const requestBody = {
      start_date: startDate,
      end_date: endDate,
      frequency: 'WRONG',
      weekly_rent: weeklyRent,
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });

  test('Check api timezone', async () => {
    const requestBody = {
      start_date: startDate,
      end_date: endDate,
      frequency,
      weekly_rent: weeklyRent,
      time_zone: 'something',
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });

  test('Check api weekly rent -1', async () => {
    const requestBody = {
      start_date: startDate,
      end_date: endDate,
      frequency,
      weekly_rent: -1,
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });
  test('Check api weekly rent 0', async () => {
    const requestBody = {
      start_date: startDate,
      end_date: endDate,
      frequency,
      weekly_rent: 0,
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });

  test('Check api weekly rent', async () => {
    const requestBody = {
      start_date: startDate,
      end_date: endDate,
      frequency,
      weekly_rent: 'ff',
      time_zone: timeZone,
    };
    const response = await request(app)
      .get('/ledger/')
      .set('Authorization', `Bearer ${token}`)
      .query(requestBody);
    expect(response.status).toBe(400);
  });
});
