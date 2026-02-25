const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    reviewerTitle: { type: String, default: "", maxlength: 150 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 2000 },
    reviewDate: { type: String, required: true },
    reviewTime: { type: String, default: "" },
    hasNewBadge: { type: Boolean, default: false },
    ownerResponse: { type: String, default: "", maxlength: 1000 },
    likes: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    source: { type: String, default: "Google" }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
