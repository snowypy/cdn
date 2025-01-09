import path from "path";
import express from "express";

const router = express.Router();

router.get('/:user/:image', (req, res) => {
    const user = req.params.user;
    const image = req.params.image;
    const imagePath = path.join(__dirname, '..', 'uploads', user, image);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).end();
        }
    });
});

export default router;