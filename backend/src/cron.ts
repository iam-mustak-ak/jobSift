import dotenv from "dotenv";
import mongoose from "mongoose";
import nodeCron from "node-cron";
import { fetchJobs } from "./jobImport";

dotenv.config();

const runScheduledImport = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI is required to import jobs.");
        return;
    }

    try {
        await mongoose.connect(mongoUri, { dbName: "jobsift" });
        await fetchJobs();
    } catch (error) {
        console.error("Scheduled job import failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

nodeCron.schedule("0 7 * * *", runScheduledImport);
