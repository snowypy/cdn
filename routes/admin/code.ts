import express from 'express';
import User from '../../model/User';
import InviteCode from '../../model/InviteCode';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/code', async (req, res) => {
    const { invitecode, maxUses = 0 } = req.body;
    const existingInviteCode = await InviteCode.findOne({ code: invitecode });
    if (existingInviteCode) {
        res.status(400).json({ error: 'Invite code already exists' });
        return;
    }
    if (maxUses < 1) {
        res.status(400).json({ error: 'Max uses must be above 1' });
        return;
    }
    
    const newInviteCode = new InviteCode({ 
        code: invitecode, 
        maxUses: maxUses, 
        currentUses: 0 
    });
    
    await newInviteCode.save();
    res.json({ success: 'Invite code created' });
});

router.delete('/code', async (req, res) => {

    const { invitecode } = req.body;
    const existingInviteCode = await InviteCode.findOne({ code: invitecode });

    if (!existingInviteCode) {
        res.status(400).json({ error: 'Invite code does not exist' });
        return;
    }

    await InviteCode.deleteOne({ code: invitecode });
    res.json({ success: 'Invite code deleted' });
});

export default router;
