const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// routes
const userRoutes = require('./api/routes/ledger');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cross origin for all requests
app.use(cors());

// middleware
app.use('/ledger', userRoutes);

// error handling
app.use((req, res, next) => {
  const error = Error('Not found');
  error.status = 404;
  next(error);
});

module.exports = app;
