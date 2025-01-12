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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../model/User"));
const router = express_1.default.Router();
router.get('/:user/:image', (req, res) => {
    const username = req.params.user;
    const image = req.params.image;
    const imagePath = path_1.default.join(__dirname, '..', 'uploads', username, image);
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).end();
        }
    });
});
router.post('/getall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const apiKey = req.body.apiKey;
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (apiKey !== user.apiKey) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    res.json({ files: user.uploadedFiles });
}));
exports.default = router;
