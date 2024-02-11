const express = require('express');
const { authMiddleware } = require('../middleware.js');
const { Account } = require('../db/db.js');
const { default: mongoose } = require('mongoose');
const router = express.Router();


// An endpoint for user to get their balance.
router.get("/balance", authMiddleware, async function (req, res) {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
});


// An endpoint for user to transfer money to another account
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(200).json({
            message: "Insufficient balance",
            status: "-1"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(200).json({
            message: "Invalid account",
            status: "-1"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json({
        message: "Transfer successful",
        status: "1"
    });
});



module.exports = {
    accountRouter: router
}