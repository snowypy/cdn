import express from "express";
import User from "../model/User";

const router = express.Router();

router.post('/safety-checks', (req, res) => {
    const { username, apiKey } = req.body;

    (async () => {
        try {
            const user = await User.findOne({username, apiKey});

            if (!user) {
                res.status(404).json({error: "User not found."});
                return;
            }

            if (user.isSuspended) {
                res.status(403).json({error: "User is suspended."});
                return;
            }

            if (user.isBanned) {
                res.status(403).json({error: "User is blacklisted."});
                return;
            }

            res.status(200).json({message: "Safety checks passed."});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Internal server error."});
        }
    })();
});

export default router;