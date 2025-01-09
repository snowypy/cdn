"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const inviteCodeSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    maxUses: { type: Number, required: true },
    currentUses: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: '30d' }
});
const InviteCode = mongoose_1.default.model('InviteCode', inviteCodeSchema);
exports.default = InviteCode;
