import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/sxcu-config', (req, res) => {
    const { username, apiKey } = req.body;

    fs.readFile(path.join(__dirname, '../../format.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Couldn\'t read config base.', code: err });
        }

        const configContent = data.replace(/<USER>/g, username).replace(/<APIKEY>/g, apiKey);

        res.attachment('config.sxcu');
        res.send(configContent);
    });
});

export default router;