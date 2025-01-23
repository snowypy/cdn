import express from 'express';
import User from '../model/User';
import InviteCode from '../model/InviteCode';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, inviteCode } = req.body;

    if (await User.findOne({ username })) {
        res.status(400).json({ error: 'An account with that username already exists' });
        return;
    }

    const validInviteCode = await InviteCode.findOne({ code: inviteCode });
    if (!validInviteCode) {
        res.status(400).json({ error: 'That is an invalid invite code.' });
        return;
    }
    if (validInviteCode.currentUses >= validInviteCode.maxUses) {
        res.status(400).json({ error: 'The invite code provided has surpassed its maximum usage.' });
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const apiKey = username + Date.now();

    const newUser = new User({ username, password: hashedPassword, apiKey, inviteCode, role: 'default' });
    await newUser.save();

    res.json({ success: 'You have been registered.', apiKey });
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

router.post('/change-password', async (req, res) => {
    const { username, password, newPassword, apiKey } = req.body;

    const user = await User.findOne({ username, apiKey });

    if (!user) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(403).json({ error: 'Invalid password' });
        return;
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ success: 'Password changed successfully' });
});

export default router;
