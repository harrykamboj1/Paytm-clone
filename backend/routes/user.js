const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db/db');
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware.js")
const { jwtSecret } = require("../config.js");
const router = express.Router();


const signUpBody = zod.object({
    username: zod.string().email(),
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
        try {
            const { success } = signUpBody.safeParse(requestBody);
            if (!success) {
                return res.status(411).json({
                    message: "Email already taken / Incorrect inputs"
                })
            }
        } catch (ex) {
            console.log("Unable to parse Signup Data :: " + ex);
            return res.status(403).json({
                message: ex.message
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
        return res.status(411).json({
            message: ex.message
        })
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
            message: "Invalid Password or Username"
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
    const filter = req.query.filter || "";
    console.log(filter)
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

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.post("/me", (req, res) => {
    debugger
    const token = req.body.token;
    if (token != null) {
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                res.status(403).json({
                    status: "-1",
                    message: "No user found"
                })
            }
            const result = await findUserIdOnTheBaisOfToken(decoded);
            if (result == null) {
                res.status(403).json({
                    status: "-1",
                    message: "No user found"
                })
            } else {
                res.status(200).json({
                    user: result,
                    status: "1",
                    message: "User Found"
                })
            }
        })
    }
})

const findUserIdOnTheBaisOfToken = async (decoded) => {
    try {
        if (decoded != null) {
            const user = await User.findOne({
                _id: decoded.userId
            });
            if (!user) {
                return null;
            }
            return user;
        }
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}


module.exports = {
    userRouter: router
}; 