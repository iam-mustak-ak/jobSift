import dotenv from "dotenv";
import mongoose from "mongoose";
import { fetchJobs } from "./jobImport";

dotenv.config();

const runJobImport = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoUri, { dbName: "jobsift" });
    try {
        const count = await fetchJobs();
        console.log(`One-time import finished. Received ${count} jobs.`);
    } finally {
        await mongoose.disconnect();
    }
};

runJobImport().catch((error: unknown) => {
    console.error("One-time job import failed:", error);
    process.exitCode = 1;
});
