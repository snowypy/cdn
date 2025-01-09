import express from 'express';
import User from '../model/User';
import InviteCode from '../model/InviteCode';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, inviteCode } = req.body;

    if (await User.findOne({ username })) {
        res.status(400).json({ error: 'There was an issue: username in use' });
        return;
    }

    const validInviteCode = await InviteCode.findOne({ code: inviteCode });
    if (!validInviteCode) {
        res.status(400).json({ error: 'There was an issue: invalid invite code' });
        return;
    }
    if (validInviteCode.currentUses >= validInviteCode.maxUses) {
        res.status(400).json({ error: 'There was an issue: invite code has reached maximum usage' });
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const apiKey = username + Date.now();

    const newUser = new User({ username, password: hashedPassword, apiKey, inviteCode, role: 'default' });
    await newUser.save();

    res.json({ success: 'You have been registered.' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(403).json({ error: 'Invalid username or password' });
        return;
    }

    res.json({ success: 'Logged in successfully', apiKey: user.apiKey });
});

export default router;
