const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false }, // Prevent password from leaking in queries
    displayName: { type: String, default: "Admin" },
    role: {
        type: String,
        enum: ["Super Admin", "Manager", "Operator"],
        default: "Operator",
        index: true
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    lastLogin: { type: Date },
    activeSessions: [{
        deviceId: String,
        token: { type: String, select: false },
        ip: String,
        lastActive: { type: Date, default: Date.now }
    }],
    permissions: {
        bookings: { type: String, enum: ["none", "read", "write"], default: "write" },
        pricing: { type: String, enum: ["none", "read", "write"], default: "read" },
        settings: { type: String, enum: ["none", "read", "write"], default: "none" }
    },
    createdAt: { type: Date, default: Date.now, index: true }
});

// Hash password before saving
// NOTE: Do NOT use 'next' param with async middleware — Mongoose uses the returned Promise
AdminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Static helper for external hashing (e.g. for bootstrap)
AdminSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

module.exports = mongoose.model("Admin", AdminSchema);
