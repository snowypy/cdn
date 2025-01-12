"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentKey_1 = __importDefault(require("../../../model/PaymentKey"));
const User_1 = __importDefault(require("../../../model/User"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
router.post('/payment/approved', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, paymentKey } = req.body;
    const payment = yield PaymentKey_1.default.findOne({ _id: new mongoose_1.Types.ObjectId(paymentKey), username: username });
    if (!payment) {
        res.status(404).json({ error: 'Payment not found' });
        return;
    }
    if (payment.used) {
        res.status(400).json({ error: 'Key already used' });
        return;
    }
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        res.status(404).json({ error: 'User not found after payment' });
        return;
    }
    user.role = 'premium';
    yield user.save();
    payment.used = true;
    yield payment.save();
    res.json({ success: 'Payment Complete' });
}));
router.post('/payment/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, role, serverKey } = req.body;
    if (serverKey !== process.env.SERVER_KEY) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (!(user.role === "premium") && role === "premium") {
        const payment = new PaymentKey_1.default({ paymentKey: 'key', username: username, package: role, used: false });
        yield payment.save();
        res.status(200).json({ success: 'Payment created' });
    }
    res.status(404).json({ error: 'Ran out of stuff to try' });
}));
exports.default = router;
