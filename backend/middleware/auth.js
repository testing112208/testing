const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(header.split(" ")[1], jwtSecret);

        // Strictly require ID (Legacy tokens won't have this)
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Legacy session. Please relogin." });
        }

        req.user = decoded; // Contains id, email, role
        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
