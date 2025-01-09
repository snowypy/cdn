import express from "express";
import PaymentKey from "../../../model/PaymentKey";
import User from "../../../model/User";
import { ObjectId, Types } from "mongoose";

const router = express.Router();

router.post('/payment/approved', async (req, res) => {
    const {username, paymentKey} = req.body;

    const payment = await PaymentKey.findOne({ _id: new Types.ObjectId(paymentKey), username: username });
    if (!payment) {
        res.status(404).json({error: 'Payment not found'});
        return;
    }

    if (payment.used) {
        res.status(400).json({error: 'Key already used'});
        return;
    }

    const user = await User.findOne({username});
    if (!user) {
        res.status(404).json({error: 'User not found after payment'});
        return;
    }
    user.role = 'premium';
    await user.save();
    payment.used = true;
    await payment.save();

    res.json({success: 'Payment Complete'});

})

router.post('/payment/create', async (req, res) => {
    const {username, role, serverKey} = req.body;

    if (serverKey !== process.env.SERVER_KEY) {
        res.status(403).json({error: 'Access denied'});
        return;
    }

    const user = await User.findOne({username});

    if (!user) {
        res.status(404).json({error: 'User not found'});
        return;
    }

    if (!(user.role === "premium") && role === "premium") {

        const payment = new PaymentKey({paymentKey: 'key', username: username, package: role, used: false});
        await payment.save();
        res.status(200).json({success: 'Payment created'});
    }

    res.status(404).json({error: 'Ran out of stuff to try'});

});

export default router;