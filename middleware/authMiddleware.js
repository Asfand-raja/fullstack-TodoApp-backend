const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 2. Verify token
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.user = decoded; // Attach user info (id, email) to req
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;
