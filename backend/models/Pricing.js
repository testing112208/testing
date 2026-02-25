const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
    cabType: { type: String, required: true, unique: true },
    basePrice: { type: Number, required: true, min: 0, default: 0 },
    priceUnit: { type: String, default: "km" }, // e.g., "km", "day", "fixed"
    imageUrl: { type: String }, // NEW: Field to store vehicle image URL
    description: String,
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Pricing", PricingSchema);
