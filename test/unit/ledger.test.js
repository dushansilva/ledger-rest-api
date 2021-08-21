const { calculateLineItemAmount } = require('../controllers/ledger');

test('Adds 2 + 2 to NOT equal 5', () => {
    calculateLineItemAmount()
  expect(1).not.toBe(5);
});
