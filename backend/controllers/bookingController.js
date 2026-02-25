const Booking = require("../models/Booking");
const axios = require("axios");
const WhatsAppService = require("../services/whatsappService");

exports.createBooking = async (req, res) => {
    try {
        console.log("New booking request received:", req.body);
        const booking = new Booking(req.body);
        await booking.save();

        // --- Telegram Notification (Reliable & Free) ---
        const tgToken = process.env.TELEGRAM_BOT_TOKEN;
        const tgChatId = process.env.TELEGRAM_CHAT_ID;

        // Helper to escape HTML for Telegram parse_mode: "HTML"
        const escapeHTML = (str) => {
            if (!str) return "";
            return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (tgToken && tgChatId) {
            try {
                const tgUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
                const tgMessage = `🚀 <b>NEW BOOKING RECEIVED</b> 🚀\n\n` +
                    `👤 <b>Customer:</b> ${escapeHTML(booking.customerName)}\n` +
                    `📞 <b>Phone:</b> ${escapeHTML(booking.phone)}\n` +
                    `📍 <b>Pickup:</b> ${escapeHTML(booking.pickup)}\n` +
                    `🏁 <b>Drop:</b> ${escapeHTML(booking.drop)}\n` +
                    `🚗 <b>Cab:</b> ${escapeHTML(booking.cabType)}\n` +
                    `📅 <b>Date:</b> ${escapeHTML(booking.date)}\n` +
                    `⏰ <b>Time:</b> ${escapeHTML(booking.time)}\n` +
                    `💰 <b>Est. Fare:</b> ₹${booking.fare}\n\n` +
                    `👉 <i>Check your Admin Panel now!</i>`;


                await axios.post(tgUrl, {
                    chat_id: tgChatId,
                    text: tgMessage,
                    parse_mode: "HTML"
                });
                console.log("Telegram Notification Sent.");
            } catch (err) {
                console.error("Telegram Notification failed:", err.response?.data || err.message);
            }
        }

        // --- WhatsApp Notification (Anti-Ban Secure JS) ---
        WhatsAppService.sendBookingAlert(booking).catch(err => console.error("WhatsApp trigger failed:", err));

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        // Optimization: Projection to only fetch summary data for the dashboard
        const bookings = await Booking.find()
            .select("customerName phone pickup drop cabType fare status createdAt date time")
            .sort({ createdAt: -1 })
            .lean();

        // Return in TOON format for high performance and low memory
        res.sendToon({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).lean();
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        res.sendToon({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        // --- Automated WhatsApp Notification to Client ---
        if (["Confirmed", "Cancelled", "Completed"].includes(status)) {
            WhatsAppService.sendCustomerNotification(booking, status).catch(err =>
                console.error(`WhatsApp notification failed for ${status}:`, err.message)
            );
        }


        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
