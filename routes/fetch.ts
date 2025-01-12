import path from "path";
import express from "express";
import User from "../model/User";

const router = express.Router();

router.get('/:user/:image', (req, res) => {
    const username = req.params.user;
    const image = req.params.image;
    const imagePath = path.join(__dirname, '..', 'uploads', username, image);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).end();
        }
    });
});

router.post('/getall', async (req, res) => {
    const username = req.body.username;
    const apiKey = req.body.apiKey;

    const user = await User.findOne({username});

    if (!user) {
        res.status(404).json({error: 'User not found'});
        return;
    }

    if (apiKey !== user.apiKey) {
        res.status(403).json({error: 'Access denied'});
        return;
    }

    res.json({files: user.uploadedFiles});
});

export default router;