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
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../model/User"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const username = req.body.username;
        const userDir = path_1.default.join(__dirname, '..', 'uploads', username);
        if (!fs_1.default.existsSync(userDir)) {
            fs_1.default.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const parts = originalName.split('_');
        const newName = parts.length > 1 ? parts[1] : originalName;
        cb(null, newName);
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, apiKey } = req.body;
    const user = yield User_1.default.findOne({ username, apiKey });
    if (!user) {
        res.status(403).json({ error: 'Invalid username or API key' });
        return;
    }
    const userDir = path_1.default.join(__dirname, '..', 'uploads', username);
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const filePath = path_1.default.join(userDir, req.file.filename);
    if (!fs_1.default.existsSync(userDir)) {
        fs_1.default.mkdirSync(userDir, { recursive: true });
    }
    fs_1.default.renameSync(req.file.path, filePath);
    user.uploadedFiles.push(req.file.filename);
    yield user.save();
    res.send(`${process.env.DOMAIN}/` + username + '/' + req.file.filename);
}));
exports.default = router;
