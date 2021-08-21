exports.handleOkResponse = (res, code, body) => {
  const response = {
    code,
    data: body,
  };
  res.status(code).json(response);
};
exports.handleErrorResponse = (res, code, body) => {
  const response = {
    code,
    message: body.message,
  };
  res.status(code).json(response);
};

exports.handleValidationResponse = (res, code, error) => {
  const response = {
    code,
    message: error.message,
    detail: error.details,
  };
  res.status(code).json(response);
};
