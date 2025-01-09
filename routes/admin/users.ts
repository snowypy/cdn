import express from 'express';
import User from '../../model/User';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/users', async (req, res) => {

    const user = await User.findOne({ username: req.query.username });

    if (user?.role === 'admin') {
        const users = await User.find();
        res.json(users);

    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});

router.post('/createadmin', async (req, res) => {
    
    const user = await User.findOne({ username: req.body.username });

    if (user?.role === 'admin') {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const apiKey = bcrypt.hashSync(username + Date.now(), 10);
        const inviteCode = '167822';
        const newUser = new User({ username, password: hashedPassword, apiKey, inviteCode, role: 'admin' });
        await newUser.save();
        res.json({ success: 'Admin created' });

    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});

export default router;