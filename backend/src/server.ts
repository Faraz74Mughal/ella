import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import connectDB from './config/db';
import { app } from './app';
import startSyncJob from './jobs/sync.job';


const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        // startSyncJob();

        app.listen(PORT, () => {
            console.log(`⚙️  Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    });