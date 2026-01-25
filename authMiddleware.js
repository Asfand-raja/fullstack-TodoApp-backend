// middleware/authMiddleware.js

// Session-based authentication middleware using Passport
const authMiddleware = (req, res, next) => {
    // Passport sets req.isAuthenticated() if session exists
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next(); // user is authenticated, allow access
    }

    // If user is not authenticated
    return res.status(401).json({ message: "Unauthorized" });
};

module.exports = authMiddleware;
