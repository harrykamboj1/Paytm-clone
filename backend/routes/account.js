const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware.js');
const { Account } = require('../db/db.js');
const { default: mongoose } = require('mongoose');


// An endpoint for user to get their balance.
router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})


// An endpoint for user to transfer money to another account
router.post('/transfer', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const { amount, to } = req.body;

        // Fetch the account within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient Balance"
            });
        }

        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Perform the transfer
        await Account.updateOne(
            { userId: req.userId }
            ,
            {
                $inc: { balance: -amount }
            }
        ).session(session);

        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (ex) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Something went wrong while transfering money"
        });
    }
})


module.exports = {
    router
}