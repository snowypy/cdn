import express from 'express';
import User from '../../../model/User';

const router = express.Router();

router.post('/ban', async (req, res) => {
    const { usernameToBan, adminUsername } = req.body;

    const adminUser = await User.findOne({ username: adminUsername });
    if (!adminUser || !(adminUser.role === 'admin' || adminUser.role === 'staff')) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

    const userToBan = await User.findOne({ username: usernameToBan });
    if (!userToBan) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    userToBan.isBanned = true;
    await userToBan.save();
    console.log(`${adminUsername} banned ${usernameToBan}`);

    res.json({ success: `${usernameToBan} has been banned.` });
});

export default router;