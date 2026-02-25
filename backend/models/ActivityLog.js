const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", index: true },
    action: { type: String, required: true }, // e.g., "LOGIN", "CHANGE_PASSWORD", "UPDATE_PRICING"
    details: String,
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now, index: true }
}, {
    // Horizontal Scalability: Prepare for MongoDB Sharding
    shardKey: { adminId: 1, timestamp: -1 }
});

// Compound index for optimized sorting and filtering by admin
ActivityLogSchema.index({ adminId: 1, timestamp: -1 });
// Hashed index for better shard distribution if using hashed sharding
ActivityLogSchema.index({ adminId: "hashed" });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
