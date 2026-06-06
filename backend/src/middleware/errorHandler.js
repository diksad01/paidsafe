import * as Sentry from "@sentry/node";
const errorHandler = (err, req, res, next) => {
  console.error(err);
  Sentry.captureException(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
};

export default errorHandler;
