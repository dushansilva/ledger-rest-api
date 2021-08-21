exports.handleOkResponse = (res, code, body) => {
  const response = {
    statusCode: code,
    data: body,
  };
  res.status(code).json(response);
};
exports.handleErrorResponse = (res, code, body) => {
  const response = {
    errorCode: code,
    message: body.message,
  };
  res.status(code).json(response);
};
