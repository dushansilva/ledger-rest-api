const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.handleError = (message) => new Error(message);

exports.generateJWT = () => {
  const privateKey = fs.readFileSync('./api/certs/key.pem', 'utf8');

  const iss = 'https://localhost:3000/oauth2/token';
  const sub = 'dushan';
  const aud = 'htpp://localhost';
  // vality period 1h
  const exp = Math.floor(Date.now() / 1000) + (60 * 60);
  const algorithm = 'RS256';
  const payload = {
    iss, sub, aud, exp,
  };
  return jwt.sign(payload, privateKey, { algorithm });
};
