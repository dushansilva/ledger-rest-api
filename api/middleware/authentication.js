const jwt = require('jsonwebtoken');
const fs = require('fs');
const { handleErrorResponse } = require('../services/response-utily');

exports.authenticate = (req, res, next) => {
  try {
    const publicKey = fs.readFileSync('./api/certs/public.pem', 'utf8');
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, publicKey);
    next();
  } catch (error) {
    handleErrorResponse(res, 401, { message: 'Authentication failed' });
  }
};
