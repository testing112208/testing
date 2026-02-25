/**
 * Admin Account Setup Script
 *
 * Creates or resets the Super Admin account in MongoDB.
 * Run once after first deployment, or any time you need to reset credentials.
 *
 * Usage:
 *   ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword node reset-admin.js
 *
 * Or set them in .env and just run:
 *   node reset-admin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdmin() {
    if (!MONGO_URI) { console.error("❌ MONGO_URI not set in .env"); process.exit(1); }
    if (!ADMIN_EMAIL) { console.error("❌ Set ADMIN_BOOTSTRAP_EMAIL (or ADMIN_EMAIL) in .env"); process.exit(1); }
    if (!ADMIN_PASSWORD) { console.error("❌ Set ADMIN_PASSWORD in .env or pass as env variable"); process.exit(1); }
    if (ADMIN_PASSWORD.length < 8) { console.error("❌ Password must be at least 8 characters"); process.exit(1); }

    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected!\n");

        const Admin = require("./models/Admin");

        // Hash directly (bypasses pre-save hook since we use findOneAndUpdate)
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const result = await Admin.findOneAndUpdate(
            { email: ADMIN_EMAIL },
            {
                email: ADMIN_EMAIL,
                password: hashed,
                displayName: "System Admin",
                activeSessions: [],
                role: "Super Admin",
                permissions: { bookings: "write", pricing: "write", settings: "write" }
            },
            { new: true, upsert: true }
        );

        console.log("✅ Admin account created/updated:");
        console.log(`   Email:    ${result.email}`);
        console.log(`   Role:     ${result.role}`);
        console.log(`   Password: (as provided — store it safely!)\n`);

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔒 Disconnected from MongoDB.");
        process.exit(0);
    }
}

resetAdmin();
