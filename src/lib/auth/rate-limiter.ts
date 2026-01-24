// Simple in-memory rate limiter (for production, consider Redis or other persistent stores)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record) {
    // First request from this identifier
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_SIZE_MS,
    });
    return { allowed: true };
  }

  // Check if window has expired
  if (now > record.resetTime) {
    // Reset the counter
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_SIZE_MS,
    });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count and allow request
  requestCounts.set(identifier, {
    count: record.count + 1,
    resetTime: record.resetTime,
  });
  return { allowed: true };
}

// Cleanup function to remove old records periodically (optional)
export function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [identifier, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(identifier);
    }
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupExpiredRecords, 30 * 60 * 1000);