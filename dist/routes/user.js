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
const User_1 = __importDefault(require("../model/User"));
const InviteCode_1 = __importDefault(require("../model/InviteCode"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, inviteCode } = req.body;
    if (yield User_1.default.findOne({ username })) {
        res.status(400).json({ error: 'An account with that username already exists' });
        return;
    }
    const validInviteCode = yield InviteCode_1.default.findOne({ code: inviteCode });
    if (!validInviteCode) {
        res.status(400).json({ error: 'That is an invalid invite code.' });
        return;
    }
    if (validInviteCode.currentUses >= validInviteCode.maxUses) {
        res.status(400).json({ error: 'The invite code provided has surpassed its maximum usage.' });
        return;
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const apiKey = username + Date.now();
    const newUser = new User_1.default({ username, password: hashedPassword, apiKey, inviteCode, role: 'default' });
    yield newUser.save();
    res.json({ success: 'You have been registered.', apiKey });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username });
    if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
        res.status(403).json({ error: 'Invalid username or password' });
        return;
    }
    res.json({ success: 'Logged in successfully', apiKey: user.apiKey });
}));
router.post('/change-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, newPassword, apiKey } = req.body;
    const user = yield User_1.default.findOne({ username, apiKey });
    if (!user) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    if (!bcrypt_1.default.compareSync(password, user.password)) {
        res.status(403).json({ error: 'Invalid password' });
        return;
    }
    user.password = bcrypt_1.default.hashSync(newPassword, 10);
    yield user.save();
    res.status(200).json({ success: 'Password changed successfully' });
}));
exports.default = router;
