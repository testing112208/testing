require("dotenv").config();
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");

const whatsappService = require("./services/whatsappService");
require("./services/cacheService");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        // Initialize Baileys WhatsApp AFTER DB is ready (needs WhatsAppAuth model)
        whatsappService.initialize();
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const mongoSanitize = require("mongo-sanitize");
const compression = require("compression");

const app = express();
app.use(compression()); // Compress all responses
const toonResponder = require("./middleware/toonResponder");

// --- 0. KEEP-ALIVE & HEALTH ---
app.get("/ping", (req, res) => res.send("pong"));
app.get("/health", (req, res) => res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
}));

// --- 1. GLOBAL SECURITY & CORS ---
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            process.env.CLIENT_URL,
        ].filter(Boolean);

        // Allow localtunnel / ngrok / cloudflare tunnel URLs for phone testing
        const isTunnel = origin && (
            origin.endsWith(".loca.lt") ||
            origin.endsWith(".ngrok.io") ||
            origin.endsWith(".ngrok-free.app") ||
            origin.endsWith(".trycloudflare.com") ||
            origin.endsWith(".pages.dev") // Explicitly allow Cloudflare Pages subdomains
        );

        if (!origin || allowed.includes(origin) || isTunnel) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-idempotency-key", "Bypass-Tunnel-Reminder"]
}));
app.use(helmet());

// --- 1.2 RENDER KEEP-ALIVE ---
// Auto-ping the server every 14 minutes to prevent Render free tier from sleeping mid-shift.
const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
if (RENDER_URL) {
    const axios = require("axios");
    setInterval(() => {
        axios.get(`${RENDER_URL}/ping`)
            .then(() => console.log(`[Keep-Alive] Self-ping successful: ${RENDER_URL}`))
            .catch(err => console.error(`[Keep-Alive] Self-ping failed: ${err.message}`));
    }, 14 * 60 * 1000); // 14 minutes
}


// --- 2. BODY PARSING & SANITIZATION ---
app.use(express.json({ limit: "10kb" })); // Block large payload attacks
// Global NoSQL Injection Protection
app.use((req, res, next) => {
    req.body = mongoSanitize(req.body);
    req.query = mongoSanitize(req.query);
    req.params = mongoSanitize(req.params);
    next();
});
app.use(toonResponder);

// --- 3. RATE LIMITS ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { success: false, message: "Too many requests" }
});
app.use("/api/", limiter);

const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
