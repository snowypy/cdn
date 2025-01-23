"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.post('/sxcu-config', (req, res) => {
    const { username, apiKey } = req.body;
    fs_1.default.readFile(path_1.default.join(__dirname, 'format.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Couldn\'t read config base.' });
        }
        const configContent = data.replace(/<USER>/g, username).replace(/<APIKEY>/g, apiKey);
        res.setHeader('Content-Disposition', 'attachment; filename=config.sxcu');
        res.setHeader('Content-Type', 'application/json');
        res.send(configContent);
    });
});
exports.default = router;
