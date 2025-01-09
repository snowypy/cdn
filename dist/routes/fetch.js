"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/:user/:image', (req, res) => {
    const user = req.params.user;
    const image = req.params.image;
    const imagePath = path_1.default.join(__dirname, '..', 'uploads', user, image);
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).end();
        }
    });
});
exports.default = router;
