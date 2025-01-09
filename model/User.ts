import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true },
    inviteCode: { type: String, required: true },
    uploadedFiles: [{ type: String }],
    role: { type: String, enum: ['default', 'premium', 'staff', 'admin'], default: 'default' },
    isBanned: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

export default User;
