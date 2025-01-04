const errorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({
    success: false,
    error: { message: err?.message, stack: err?.stack },
  });
};

export default errorHandler;
