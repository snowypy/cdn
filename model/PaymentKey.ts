import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentKey: { type: String, required: true, default: () => Math.random().toString(36).substring(2, 26) },
    username: { type: String, required: true },
    package: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    used: { type: Boolean, default: false }
});

const PaymentKey = mongoose.model('PaymentKey', paymentSchema);

export default PaymentKey;