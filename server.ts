import express, { Request, Response } from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from './model/User';
import { connectDatabase } from './data-source';
import userRoutes from './routes/user';
import uploadRoutes from './routes/upload';
import adminCodeRoutes from './routes/admin/code';
import adminUserRoutes from './routes/admin/users';
import fetchRoutes from './routes/fetch';
import safteyRoutes from './routes/safety';
import paymentRoutes from './routes/admin/premium/payment';

const app = express();
app.use(express.json());
connectDatabase();

app.use('/api/v1', userRoutes, uploadRoutes);
app.use('/api/admin', adminCodeRoutes, adminUserRoutes);
app.use('/api/middleware', safteyRoutes);
app.use('/api/gateway', paymentRoutes);

// This is just for serving the files
app.use('/', fetchRoutes)

app.listen(process.env.PORT || 3000, () => {
    console.log(`The cdn backend api is now running and is connected to the Mongo User Database`);
});