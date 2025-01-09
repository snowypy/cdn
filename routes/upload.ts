import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from '../model/User';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const username = req.body.username;
        const userDir = path.join(__dirname, '..', 'uploads', username);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
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

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    const { username, apiKey } = req.body;

    const user = await User.findOne({ username, apiKey });
    if (!user) {
        res.status(403).json({ error: 'Invalid username or API key' });
        return;
    }

    const userDir = path.join(__dirname, '..', 'uploads', username);
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const filePath = path.join(userDir, req.file.filename);

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    fs.renameSync(req.file.path, filePath);

    user.uploadedFiles.push(req.file.filename);
    await user.save();

    res.send(`${process.env.DOMAIN}/` + username + '/' + req.file.filename);
});

export default router;