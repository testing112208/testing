const Admin = require("../models/Admin");
const ActivityLog = require("../models/ActivityLog");
const jwt = require("jsonwebtoken");
const { jwtSecret, bootstrapAdminEmail } = require("../config/config");

// Helper to log activity
const logAction = async (adminId, action, details, req) => {
    try {
        await ActivityLog.create({
            adminId,
            action,
            details,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });
    } catch (e) { console.error("Log failed", e); }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Explicitly select password for comparison (it's hidden by default)
        const admin = await Admin.findOne({ email }).select("+password");

        // SECURITY: If no admin in DB, direct to CLI setup script.
        // Credentials are NOT stored in source code.
        if (!admin) {
            if (bootstrapAdminEmail && email === bootstrapAdminEmail) {
                console.warn("⚠️ [Bootstrap] Admin not found in DB. Run `node reset-admin.js` to create the first admin account.");
            }
            console.log(`❌ Login Failed for ${email}. No admin account found.`);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.log(`❌ Login Failed for ${email}. Wrong password.`);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Role Migration: normalise legacy role values
        if (["admin", "superadmin"].includes(admin.role)) {
            admin.role = "Super Admin";
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            jwtSecret,
            { expiresIn: "8h" }
        );

        // Track session — keep max 5 to prevent unbounded growth
        if (admin.activeSessions.length >= 5) {
            admin.activeSessions.shift(); // Remove oldest session
        }
        admin.activeSessions.push({
            deviceId: req.headers["user-agent"] || "unknown",
            token,
            ip: req.ip,
            lastActive: new Date()
        });
        admin.lastLogin = new Date();
        await admin.save();

        await logAction(admin._id, "LOGIN", "Successful login", req);

        return res.json({
            success: true,
            token,
            admin: {
                email: admin.email,
                role: admin.role,
                displayName: admin.displayName
            }
        });
    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Legacy session detected. Please log out and back in." });
        }
        const admin = await Admin.findById(req.user.id)
            .select("email role displayName permissions lastLogin createdAt")
            .lean();

        if (!admin) return res.status(404).json({ success: false, message: "Admin not found. Please relogin." });
        res.json({ success: true, data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Both oldPassword and newPassword are required." });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    }

    try {
        const admin = await Admin.findById(req.user.id).select("+password");
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });

        // FIX: Use bcrypt comparePassword (correctly awaited)
        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect old password." });
        }

        // Assign plain text — pre-save hook in Admin model hashes it with bcrypt automatically
        admin.password = newPassword;
        await admin.save();

        await logAction(admin._id, "CHANGE_PASSWORD", "Password updated successfully", req);
        res.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Legacy session detected. Please log out and back in." });
        }
        const admin = await Admin.findById(req.user.id)
            .select("activeSessions")
            .lean();

        if (!admin) return res.status(404).json({ success: false, message: "Admin profile missing" });
        res.json({ success: true, data: admin.activeSessions || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logoutSession = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        admin.activeSessions = admin.activeSessions.filter(s => s._id.toString() !== sessionId);
        await admin.save();
        res.json({ success: true, message: "Session terminated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });

        const logs = await ActivityLog.find({ adminId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(20)
            .lean();

        res.sendToon({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const WhatsAppService = require("../services/whatsappService");
const WhatsAppAuth = require("../models/WhatsAppAuth");

exports.getWhatsappStatus = async (req, res) => {
    try {
        const status = WhatsAppService.getStatus();
        res.json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** Clear saved session and force a fresh QR scan */
exports.resetWhatsapp = async (req, res) => {
    try {
        await WhatsAppAuth.deleteMany({}); // Clear all saved Baileys keys from MongoDB
        WhatsAppService.sock = null;    // Reset socket
        WhatsAppService.isReady = false;
        WhatsAppService.status = 'initializing';
        WhatsAppService.qrCode = null;
        WhatsAppService._retries = 0;

        // Re-initialise — will generate fresh QR code
        WhatsAppService.initialize().catch(err => console.error('WA Reinit Error:', err));

        res.json({ success: true, message: "WhatsApp session cleared. New QR code will appear in the panel within 10 seconds." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
