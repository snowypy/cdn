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
const router = express_1.default.Router();
router.post('/safety-checks', (req, res) => {
    const { username, apiKey } = req.body;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({ username, apiKey });
            if (!user) {
                res.status(404).json({ error: "User not found." });
                return;
            }
            if (user.isSuspended) {
                res.status(403).json({ error: "User is suspended." });
                return;
            }
            if (user.isBanned) {
                res.status(403).json({ error: "User is blacklisted." });
                return;
            }
            res.status(200).json({ message: "Safety checks passed." });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error." });
        }
    }))();
});
exports.default = router;
