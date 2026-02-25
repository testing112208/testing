const cache = require("../services/cacheService");

/**
 * Idempotency Middleware
 * Prevents duplicate actions (like bookings) if the same request is sent twice.
 * Expects 'x-idempotency-key' in request headers.
 */
module.exports = async (req, res, next) => {
    const key = req.headers["x-idempotency-key"];

    if (!key) {
        return next(); // Proceed normally if no key is provided
    }

    const cacheKey = `idempotency:${key}`;

    try {
        const cachedResponse = await cache.get(cacheKey);

        if (cachedResponse) {
            console.log(`[Idempotency] Duplicate request detected for key: ${key}. Returning cached response.`);
            return res.status(200).json(cachedResponse);
        }

        // Wrap res.json to capture and cache the response
        const originalJson = res.json;
        res.json = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(cacheKey, body, 86400); // Cache success results for 24 hours
            }
            return originalJson.call(this, body);
        };

        next();
    } catch (error) {
        console.error("[Idempotency] Error:", error);
        next();
    }
};
