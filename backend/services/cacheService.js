const Redis = require("ioredis");

class CacheService {
    constructor() {
        this.redis = null;
        this.init();
    }

    init() {
        if (this.redis) return; // Already connected

        if (process.env.REDIS_URL) {
            console.log("🔗 Redis Found! Initializing connection...");
            this.redis = new Redis(process.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => Math.min(times * 50, 2000)
            });

            this.redis.on("error", (err) => {
                console.error("❌ Redis Error:", err.message);
            });

            this.redis.on("connect", () => {
                console.log("🔗 Redis Attempting Connection...");
            });

            this.redis.on("ready", () => {
                console.log("🚀 Redis Cache Connected & Ready");
            });
        }
    }

    async get(key) {
        try {
            if (!this.redis || this.redis.status !== "ready") return null;
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn("⚠️ Redis Get Error (Falling back to DB):", e.message);
            return null;
        }
    }

    async set(key, value, expirySeconds = 3600) {
        this.init();
        if (!this.redis) return;
        try {
            await this.redis.set(key, JSON.stringify(value), "EX", expirySeconds);
        } catch (e) {
            console.error("Redis Set Error", e);
        }
    }

    async del(key) {
        this.init();
        if (!this.redis) return;
        try {
            await this.redis.del(key);
        } catch (e) {
            console.error("Redis Del Error", e);
        }
    }

    async flush() {
        if (!this.redis) return;
        await this.redis.flushall();
    }
}

module.exports = new CacheService();
