const express = require('express');
const userRouter = require('./routes/user.js');
const accountRouter = require('../routes/account.js');

// use to handle requests coming rom /api/v1
const router = express.Router();

router.use('/user', userRouter);
router.use('/account', accountRouter);

module.exports = router;