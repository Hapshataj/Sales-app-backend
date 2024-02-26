
const express = require('express');
const router = express.Router();
const { JWT_SECRET } = require("../config");
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const ProtectedRoute = require("../middleware/ProtectedResource");
const PostModel = mongoose.model('PostModel');

//------------------------------add all sale entry--------------
router.post("/addsale", ProtectedRoute, (req, res) => {
    const { productName, quantity, saleAmount } = req.body;
    if (!productName || !quantity || !saleAmount) {
        return res.status(400).json({ error: "one or more field is madatory is empty!" });
    }
    req.user.password = undefined
    const addsaleObj = new PostModel({ productName: productName, quantity: quantity, saleAmount: saleAmount })
    addsaleObj.save()
        .then((newsaleentry) => {
            res.status(201).json({ product: newsaleentry });
        })
        .catch((error) => {
            console.log(error);
        })
});
/*--------------------display top 5 sale---------------*/
router.get("/top5sale", async (req, res) => {
    try {
        const docs = await PostModel.find().sort({ saleAmount: -1 }).limit(5);  // here it will display top 5 sales



        res.status(200).send(docs);
    }
    catch (error) {
        res.status(500).send({ message: "Error Occured", error: error });
    }
})
//---------  total revenue data will display
router.get("/todaytotal", async (req, res) => {
    try {
        const total = await PostModel.aggregate([
            {
                $group: { _id: null, sum: { $sum: "$saleAmount" } }
            }
        ])

        res.status(200).send(total);
    }
    catch (error) {
        res.status(500).send({ message: "Error Occured", error: error });

    }

});

module.exports = router;