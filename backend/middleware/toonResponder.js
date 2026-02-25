const { encode } = require("@toon-format/toon");

/**
 * Middleware to send responses in TOON format if requested or by default
 * This reduces token usage and improves speed for AI/LLM integrations
 */
module.exports = (req, res, next) => {
    res.sendToon = (data) => {
        try {
            const toonData = encode(data);
            res.setHeader("Content-Type", "text/toon");
            return res.send(toonData);
        } catch (error) {
            console.error("TOON encoding error:", error);
            return res.status(500).json({ success: false, message: "Encoding error" });
        }
    };
    next();
};
