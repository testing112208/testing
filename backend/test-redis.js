const Redis = require("ioredis");
require("dotenv").config();

async function testRedis() {
    console.log("Testing Redis connection to:", process.env.REDIS_URL.split('@')[1] || "local");
    const redis = new Redis(process.env.REDIS_URL);

    try {
        await redis.set("test_key", "test_value");
        const val = await redis.get("test_key");
        console.log("✅ Redis Test Success! Value:", val);
        process.exit(0);
    } catch (err) {
        console.error("❌ Redis Test Failed:", err);
        process.exit(1);
    }
}

testRedis();
