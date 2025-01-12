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
const InviteCode_1 = __importDefault(require("../../model/InviteCode"));
const router = express_1.default.Router();
router.post('/code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invitecode, maxUses = 0 } = req.body;
    const existingInviteCode = yield InviteCode_1.default.findOne({ code: invitecode });
    if (existingInviteCode) {
        res.status(400).json({ error: 'Invite code already exists' });
        return;
    }
    if (maxUses < 1) {
        res.status(400).json({ error: 'Max uses must be above 1' });
        return;
    }
    const newInviteCode = new InviteCode_1.default({
        code: invitecode,
        maxUses: maxUses,
        currentUses: 0
    });
    yield newInviteCode.save();
    res.json({ success: 'Invite code created' });
}));
router.delete('/code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invitecode } = req.body;
    const existingInviteCode = yield InviteCode_1.default.findOne({ code: invitecode });
    if (!existingInviteCode) {
        res.status(400).json({ error: 'Invite code does not exist' });
        return;
    }
    yield InviteCode_1.default.deleteOne({ code: invitecode });
    res.json({ success: 'Invite code deleted' });
}));
exports.default = router;
