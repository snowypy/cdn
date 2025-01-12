import express from "express";
import User from "../model/User";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post('/delete', async (req, res) => {
    const { username, apiKey, fileName } = req.body;

    const user = await User.findOne({ username, apiKey });

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    if (user.uploadedFiles.indexOf(fileName) === -1) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    user.uploadedFiles = user.uploadedFiles.filter((file: string) => file !== fileName);
    await user.save();

    const filePath = path.join(__dirname, '..', 'uploads', username, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'File deleted' });

});

router.post('/deleteall', async (req, res) => {
    const { username, apiKey } = req.body;

    const user = await User.findOne({ username, apiKey });

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    user.uploadedFiles.forEach((file: string) => {
        const filePath = path.join(__dirname, '..', 'uploads', username, file);
        if (fs.existsSync(filePath
        )) {
            fs.unlinkSync(filePath);
        }
    });

    res.status(200).json({ message: 'Files all deleted' });

});

export default router;