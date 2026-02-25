'use strict';

/**
 * WhatsApp Service — Powered by @whiskeysockets/baileys
 *
 * WHY BAILEYS INSTEAD OF whatsapp-web.js?
 * ────────────────────────────────────────
 * whatsapp-web.js uses Puppeteer + Chromium → ~400-500MB RAM → CRASHES Render free tier
 * Baileys uses raw WebSocket (no browser) → ~40-80MB RAM → WORKS on free tier
 *
 * FREE TIER STRATEGY:
 * 1. Baileys connects via WebSocket and stores auth in MongoDB
 * 2. On server restart/wake, reconnects from MongoDB creds (no QR re-scan)
 * 3. UptimeRobot pings /ping every 14 min → Render never sleeps → stays connected
 * 4. Total extra cost: $0
 */

const WhatsAppAuth = require('../models/WhatsAppAuth');

// ─────────────────────────────────────────────────────────
// MongoDB-based Baileys Auth State
// Replaces the default file-system auth with MongoDB
// so sessions survive server restarts on Render
// ─────────────────────────────────────────────────────────
async function buildMongoAuthState(initAuthCreds, BufferJSON) {
    const read = async (id) => {
        try {
            const doc = await WhatsAppAuth.findById(id).lean();
            if (!doc) return null;
            return JSON.parse(doc.data, BufferJSON.reviver);
        } catch {
            return null;
        }
    };

    const write = async (id, data) => {
        await WhatsAppAuth.findByIdAndUpdate(
            id,
            { data: JSON.stringify(data, BufferJSON.replacer) },
            { upsert: true }
        );
    };

    const remove = async (id) => {
        await WhatsAppAuth.findByIdAndDelete(id);
    };

    const creds = (await read('creds')) || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        data[id] = await read(`${type}-${id}`);
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category of Object.keys(data)) {
                        for (const id of Object.keys(data[category])) {
                            const value = data[category][id];
                            tasks.push(
                                value
                                    ? write(`${category}-${id}`, value)
                                    : remove(`${category}-${id}`)
                            );
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => write('creds', creds)
    };
}

// Silent logger — Baileys is very verbose; we only want warnings/errors
const silentLogger = {
    level: 'silent',
    trace: () => { }, debug: () => { }, info: () => { },
    warn: (...a) => console.warn('[Baileys]', ...a),
    error: (...a) => console.error('[Baileys]', ...a),
    fatal: (...a) => console.error('[Baileys]', ...a),
    child: () => silentLogger,
};

class WhatsAppService {
    constructor() {
        this.sock = null;
        this.qrCode = null;
        this.status = 'initializing';
        this.isReady = false;
        this._retries = 0;
        this._maxRetries = 5;
        this._isInitializing = false;
    }


    async initialize() {
        if (process.env.DISABLE_WHATSAPP === 'true') {
            console.log('[WhatsApp] Disabled via DISABLE_WHATSAPP=true. Telegram handles notifications.');
            this.status = 'disabled';
            return;
        }

        if (this.sock || this._isInitializing) return;
        this._isInitializing = true;

        console.log('[WhatsApp/Baileys] Starting connection attempt...');

        try {
            // Dynamic import handles Baileys whether it ships as ESM or CJS
            const B = await import('@whiskeysockets/baileys');
            const { Boom } = await import('@hapi/boom');

            const makeWASocket = B.default;
            const { DisconnectReason, fetchLatestBaileysVersion,
                initAuthCreds, BufferJSON } = B;

            const { version } = await fetchLatestBaileysVersion();
            console.log(`[WhatsApp/Baileys] Using WA version: ${version.join('.')}`);

            const { state, saveCreds } = await buildMongoAuthState(initAuthCreds, BufferJSON);

            this.sock = makeWASocket({
                version,
                auth: state,
                logger: silentLogger,
                printQRInTerminal: false,
                browser: ['Trimurti', 'Chrome', '4.0.0'],
                markOnlineOnConnect: false,
                syncFullHistory: false,
                generateHighQualityLinkPreview: false,
                connectTimeoutMs: 60000, // Increased for Free Tier CPU
                defaultQueryTimeoutMs: 0, // Disable timeout to prevent 408s
            });

            this._isInitializing = false;

            // Persist updated credentials to MongoDB
            this.sock.ev.on('creds.update', saveCreds);


            // Connection lifecycle
            this.sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
                if (qr) {
                    this.qrCode = qr;
                    this.status = 'qr_ready';
                    this.isReady = false;
                    console.log('[WhatsApp/Baileys] ✅ QR ready — scan at Admin Panel → WhatsApp tab');
                }

                if (connection === 'close') {
                    this.isReady = false;
                    this.sock = null; // Allow re-init

                    const code = lastDisconnect?.error instanceof Boom
                        ? lastDisconnect.error.output?.statusCode
                        : undefined;

                    if (code === DisconnectReason.loggedOut) {
                        console.warn('[WhatsApp/Baileys] Logged out — clearing saved session. Rescan QR.');
                        this.status = 'logged_out';
                        await WhatsAppAuth.deleteMany({});
                        return; // Don't reconnect — needs fresh QR scan
                    }

                    if (this._retries < this._maxRetries) {
                        this._retries++;
                        const delay = Math.min(this._retries * 3000, 15000);
                        console.log(`[WhatsApp/Baileys] Reconnecting (attempt ${this._retries}) in ${delay / 1000}s...`);
                        this.status = 'reconnecting';
                        setTimeout(() => this.initialize(), delay);
                    } else {
                        console.error('[WhatsApp/Baileys] Max retries reached. Check AdminPanel → WhatsApp tab.');
                        this.status = 'error';
                    }
                }

                if (connection === 'open') {
                    this.isReady = true;
                    this.qrCode = null;
                    this.status = 'ready';
                    this._retries = 0;
                    this._isInitializing = false;
                    console.log('✅ [WhatsApp/Baileys] Connected! Notifications active.');
                }
            });

        } catch (err) {
            console.error('[WhatsApp/Baileys] Init Error:', err.message);
            this.status = 'error';
            this._isInitializing = false;
        }

    }

    getStatus() {
        return {
            status: this.status,
            qrCode: this.qrCode,
            isReady: this.isReady,
        };
    }

    /** Internal: low-level send with human-like anti-ban protection */
    async _send(rawPhone, message) {
        if (!this.isReady || !this.sock) {
            console.warn('[WhatsApp/Baileys] Not ready — message skipped.');
            return;
        }

        // Normalise to JID format: 91XXXXXXXXXX@s.whatsapp.net
        const digits = rawPhone.replace(/\D/g, '');
        const phone = digits.length === 10 ? `91${digits}` : digits;
        const jid = `${phone}@s.whatsapp.net`;

        try {
            // Anti-ban Phase 1: Simulate "Typing..." presence (3–7 seconds)
            // This tells WhatsApp the user is active and typing a message
            await this.sock.sendPresenceUpdate('composing', jid);

            const typingDuration = Math.floor(Math.random() * 4000) + 3000;
            await new Promise(r => setTimeout(r, typingDuration));

            // Stop typing status
            await this.sock.sendPresenceUpdate('paused', jid);

            // Anti-ban Phase 2: Final human jitter (1-2 seconds)
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 1000) + 1000));

            await this.sock.sendMessage(jid, { text: message });
            console.log(`[WhatsApp/Baileys] Human-like message sent to ${phone}`);
        } catch (err) {
            console.error('[WhatsApp/Baileys] Send Error:', err.message);
        }
    }


    /** Send booking alert to admin and drivers */
    async sendBookingAlert(booking) {
        const adminPhones = process.env.WHATSAPP_PHONE;
        if (!adminPhones) return;

        // Support multiple phones separated by commas (e.g., 91XXXXXXXXXX,91YYYYYYYYYY)
        const phoneList = adminPhones.split(',').map(p => p.trim());

        const ref = booking._id?.toString().slice(-6).toUpperCase() || 'NEW';
        const greetings = ['🚨 *New Booking!*', '🚕 *Incoming Request:*', '✨ *Fresh Trip:*', '📍 *New Schedule:*'];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        const message =
            `${greeting}\n\n` +
            `🆔 *Ref:* #${ref}\n` +
            `👤 *Name:* ${booking.customerName}\n` +
            `📞 *Phone:* ${booking.phone}\n` +
            `📍 *From:* ${booking.pickup}\n` +
            `🏁 *To:* ${booking.drop}\n` +
            `🚗 *Cab:* ${booking.cabType}\n` +
            `📅 *Date:* ${booking.date}\n` +
            `⏰ *Time:* ${booking.time}\n` +
            `💰 *Fare:* ₹${booking.fare}\n\n` +
            `_Check Admin Panel for full details_`;

        for (const phone of phoneList) {
            await this._send(phone, message);
        }
    }


    /** Send status update to customer */
    async sendCustomerNotification(booking, status) {
        const ref = booking._id?.toString().slice(-6).toUpperCase() || 'NEW';
        let message = '';

        if (status === 'Confirmed') {
            message =
                `*Trimurti Tours & Travels* 🚕\n\n` +
                `✅ *Booking Confirmed!*\n\n` +
                `Your ride (#${ref}) is confirmed for *${booking.date}* at *${booking.time}*.\n\n` +
                `📍 *Pickup:* ${booking.pickup}\n` +
                `🏁 *Drop:* ${booking.drop}\n` +
                `🚗 *Cab:* ${booking.cabType}\n` +
                `💰 *Est. Fare:* ₹${booking.fare}\n\n` +
                `Our driver will contact you shortly before pickup.\n` +
                `📞 Support: +91 80070 65150`;
        } else if (status === 'Cancelled') {
            message =
                `*Trimurti Tours & Travels* 🚕\n\n` +
                `🚫 *Booking Update (#${ref})*\n\n` +
                `We regret your booking has been *CANCELLED*.\n\n` +
                `📞 Call us: +91 80070 65150`;
        } else if (status === 'Completed') {
            message =
                `*Trimurti Tours & Travels* 🚕\n\n` +
                `🎉 *Trip Completed (#${ref})*\n\n` +
                `Thank you for riding with us!\n` +
                `We hope you had a pleasant journey.\n\n` +
                `📞 Support: +91 80070 65150`;
        } else {
            return; // No notification for other statuses
        }


        await this._send(booking.phone, message);
    }
}

// Singleton — one persistent WA connection for the server lifetime
module.exports = new WhatsAppService();
