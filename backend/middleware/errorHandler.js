import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "error.log"
  );

  console.log(err.stack);

  const status =
    res.statusCode !== 200 && res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({
    success: false,
    error: err?.message,
    isError: true,
  });
};

export default errorHandler;
