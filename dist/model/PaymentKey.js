"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    paymentKey: { type: String, required: true, default: () => Math.random().toString(36).substring(2, 26) },
    username: { type: String, required: true },
    package: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    used: { type: Boolean, default: false }
});
const PaymentKey = mongoose_1.default.model('PaymentKey', paymentSchema);
exports.default = PaymentKey;
