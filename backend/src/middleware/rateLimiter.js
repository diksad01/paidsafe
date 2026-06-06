import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Protects all routes from abuse
 */
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  message: {
    error: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default rateLimiter;