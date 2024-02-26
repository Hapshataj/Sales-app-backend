
const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
//----------------------------------Registration--------------------------
router.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json("One or more mandatory fields are empty !");
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                res.status(500).json("User with this email already registered !");

            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        })
});

/*---------------------------login------------------------*/
/* login */
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "one or more field is madatory is empty!" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {

                return res.status(401).json({ error: "Invalid Crediantials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {

                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "email": userInDB.email, "firstName": userInDB.firstName, "lastName": userInDB.lastName }
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });

                    }
                    else {
                        return res.status(401).json({ error: "Invalid Crediantials" });

                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

module.exports = router;