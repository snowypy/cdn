"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true },
    inviteCode: { type: String, required: true },
    uploadedFiles: [{ type: String }],
    role: { type: String, enum: ['default', 'premium', 'staff', 'admin'], default: 'default' },
    isBanned: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
