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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, apiKey, fileName } = req.body;
    const user = yield User_1.default.findOne({ username, apiKey });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (user.uploadedFiles.indexOf(fileName) === -1) {
        res.status(404).json({ error: 'Couldn\'t find file in user db' });
        return;
    }
    user.uploadedFiles = user.uploadedFiles.filter((file) => file !== fileName);
    yield user.save();
    const filePath = path_1.default.join(__dirname, '..', 'uploads', username, fileName);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'The file has been deleted from the file server' });
}));
router.post('/deleteall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, apiKey } = req.body;
    const user = yield User_1.default.findOne({ username, apiKey });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const userFolderPath = path_1.default.join(__dirname, '..', 'uploads', username);
    if (fs_1.default.existsSync(userFolderPath)) {
        fs_1.default.rmdirSync(userFolderPath, { recursive: true });
    }
    res.status(200).json({ message: 'All your files have been permenantly removed from our servers.' });
}));
exports.default = router;
