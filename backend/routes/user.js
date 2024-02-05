const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db/db');
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware.js")
const { jwtSecret } = require("../config.js");
const router = express.Router();


const signUpBody = zod.object({
    username: zod.string().email,
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

// User SignUp request
router.post("/signup", async (req, res) => {
    try {
        const requestBody = req.body;
        const { success } = signUpBody.safeParse(requestBody);

        if (!success) {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        // Check if user exists in db or not
        const existingUser = await User.findOne({
            username: req.body.username
        })

        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken/Incorrect inputs"
            })
        }

        // Create a user in database server
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })

        const userId = user._id;

        // --------- Create a new Account for the User -----------------
        // This is so we don’t have to integrate with banks and give them random balances to start with.
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        // Generating a jwt token for userId
        const token = jwt.sign({
            userId
        }, jwtSecret
        );

        res.json({
            message: "User created successfully",
            token: token
        })

    } catch (ex) {
        console.log("Exception while making signup request call :: " + ex);
    }

})

// User Sign In Request
router.post("/signin", async (req, res) => {
    try {
        const requestBody = req.body;
        const { success } = signInBody.safeParse(req.body);

        if (!success) {
            res.status(411).json({
                message: "Incorrect inputs"
            })
        }

        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });

        if (user) {
            const token = jwt.sign({
                userId: user._id
            }, jwtSecret);

            res.json({
                token: token
            })
            return;
        }

        res.status(411).json({
            message: "Error while logging in"
        })

    } catch (ex) {
        console.log("Exception while making signin request call :: " + ex);
    }
})

const updateUserSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

// Update User Details
router.put("/", authMiddleware, async (req, res) => {
    const { success } = zod.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        _id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})


// Get User From Backend using data Filter such as FirstName and lastName

router.get("/bulk", async (req, res) => {
    const parameter = req.query.filter || "";
    if (parameter == "") {
        res.json({
            message: "No User Found"
        })
    }

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    if (users != null && users != undefined) {
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        })
    }
})

module.exports = router; 