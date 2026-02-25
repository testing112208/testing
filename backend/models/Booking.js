const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
        index: true
    },
    email: String,
    pickup: { type: String, required: true },
    drop: { type: String, required: true },
    cabType: {
        type: String,
        required: true,
        enum: [
            "Sedan Cab Amravati",
            "SUV Taxi Service",
            "Nagpur Pick-up & Drop",
            "Corporate Taxi Hire",
            "Intercity Cab Amravati",
            "Mini Van (Winger)",
            "Cruiser",
            "Tempo Traveller Taxi",
            "Sedan", "SUV", "Tempo Traveller", // Keep old ones for legacy
            "Local Taxi in Amravati", "Outstation Cab Booking" // Service types
        ]
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    fare: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending",
        index: true
    },
    createdAt: { type: Date, default: Date.now, index: true }
}, {
    // Sharding Ready: Distribute millions of bookings by phone number
    shardKey: { phone: 1 }
});

// Hashed index for balanced sharding distribution
BookingSchema.index({ phone: "hashed" });

module.exports = mongoose.model("Booking", BookingSchema);
