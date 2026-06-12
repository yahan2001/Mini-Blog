// Rate Limiter for Gemini API - prevents hitting quota limits
// Tracks API calls per time window

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    // maxRequests: max API calls allowed per window
    // windowMs: time window in milliseconds (default 1 minute)
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  // Check if request is allowed
  isAllowed() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if limit exceeded
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const resetTime = oldestRequest + this.windowMs;
      const waitMs = resetTime - now;
      
      return {
        allowed: false,
        waitMs: Math.max(0, waitMs),
        message: `Rate limit exceeded. Please wait ${Math.ceil(waitMs / 1000)} seconds.`
      };
    }
    
    // Record this request
    this.requests.push(now);
    
    return {
      allowed: true,
      waitMs: 0,
      message: "Request allowed"
    };
  }

  // Get current request count
  getCount() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length;
  }

  // Get reset time in seconds
  getResetTime() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    const resetTime = oldestRequest + this.windowMs;
    const waitMs = resetTime - Date.now();
    return Math.max(0, Math.ceil(waitMs / 1000));
  }
}

// Create a rate limiter instance for Gemini API
// Allow 10 requests per minute (conservative limit)
export const geminiRateLimiter = new RateLimiter(10, 60000);

// Middleware for rate limiting
export const rateLimitMiddleware = (maxRequests = 10, windowMs = 60000) => {
  const limiter = new RateLimiter(maxRequests, windowMs);
  
  return (req, res, next) => {
    const check = limiter.isAllowed();
    
    if (!check.allowed) {
      return res.status(429).json({
        success: false,
        statusCode: 429,
        message: check.message,
        retryAfter: check.waitMs
      });
    }
    
    // Add rate limit info to response headers
    res.set('X-RateLimit-Remaining', limiter.maxRequests - limiter.getCount());
    res.set('X-RateLimit-Reset', limiter.getResetTime());
    
    next();
  };
};

export default RateLimiter;
