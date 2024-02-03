const express = require('express');
const userRouter = require('./routes/user.js');

// use to handle requests coming rom /api/v1
const router = express.Router();

router.use('/user', userRouter);

module.exports = router;