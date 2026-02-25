const mongoose = require('mongoose');

// Stores Baileys auth keys by ID (creds, signal keys, etc.)
// Each document is a key-value pair where _id = key name, data = serialised JSON
const WhatsAppAuthSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    data: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppAuth', WhatsAppAuthSchema);
