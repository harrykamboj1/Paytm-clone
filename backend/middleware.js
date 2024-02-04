const { jwtSecret } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();

        } else {
            return res.status(403).json({});
        }


    } catch (ex) {
        return res.status(403).json({});
    }

}

// Export the middleware function
module.exports = {
    authMiddleware,
};