import express from 'express';
import User from '../../../model/User';

const router = express.Router();

router.post('/suspend', async (req, res) => {
    const { usernameToSuspend, adminUsername } = req.body;

    const adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser || !(adminUser.role === 'admin' || adminUser.role === 'staff')) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

    const userToSuspend = await User.findOne({ username: usernameToSuspend });
    if (!userToSuspend) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    userToSuspend.isSuspended = true;
    await userToSuspend.save();

    console.log(`${adminUsername} suspended ${usernameToSuspend}`);

    res.json({ success: `${usernameToSuspend} has been suspended.` });
});