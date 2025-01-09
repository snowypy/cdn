import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    maxUses: { type: Number, required: true },
    currentUses: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: '30d' }
});

const InviteCode = mongoose.model('InviteCode', inviteCodeSchema);

export default InviteCode;
