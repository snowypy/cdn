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
const User_1 = __importDefault(require("../../model/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ username: req.query.username });
    if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        const users = yield User_1.default.find();
        res.json(users);
    }
    else {
        res.status(403).json({ error: 'Access denied' });
    }
}));
router.post('/createadmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ username: req.body.username });
    if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        const { username, password } = req.body;
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        const apiKey = bcrypt_1.default.hashSync(username + Date.now(), 10);
        const inviteCode = '167822';
        const newUser = new User_1.default({ username, password: hashedPassword, apiKey, inviteCode, role: 'admin' });
        yield newUser.save();
        res.json({ success: 'Admin created' });
    }
    else {
        res.status(403).json({ error: 'Access denied' });
    }
}));
exports.default = router;
