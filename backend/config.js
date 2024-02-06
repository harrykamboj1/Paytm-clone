require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    mongodbUri: process.env.MONGODB_URI,
};