import axios from "axios";
import dotenv from "dotenv";
import JobCategory from "./models/jobCategory.model";
import Skill from "./models/skill.model";
// import cron from "node-cron";

dotenv.config();

const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY!,
        "x-rapidapi-host": process.env.RAPID_API_HOST!,
    },
};

const fetchJobs = async () => {
    try {
        const response = await axios.get(process.env.JOB_API_URI!, options);
        const allJobs = response.data;
        await getAndCreateCategories(allJobs);
        await getAndCreateSkills(allJobs);

        console.log(`Processed ${allJobs.length} jobs`);
    } catch (err) {
        console.error("Error fetching jobs:", err);
    }
};

const getAndCreateCategories = async (allJobs: any[]) => {
    try {
        for (const job of allJobs) {
            if (!Array.isArray(job.categories)) continue;

            for (const category of job.categories) {
                const name = category.trim();
                if (!name) continue;

                const exists = await JobCategory.findOne({ name });
                if (exists) continue;

                const newCategory = new JobCategory({ name });
                await newCategory.save();
            }
        }
        console.log("Categories saved");
    } catch (error) {
        console.error("Error saving categories:", error);
    }
};

const getAndCreateSkills = async (allJobs: any[]) => {
    try {
        for (const job of allJobs) {
            if (!Array.isArray(job.skills)) continue;

            for (const skill of job.skills) {
                const name = skill.trim();
                if (!name) continue;

                const exists = await Skill.findOne({ name });
                if (exists) continue;

                const newSkill = new Skill({ name });
                await newSkill.save();
            }
        }
        console.log("Skills saved");
    } catch (error) {
        console.error("Error saving skills:", error);
    }
};

// Run once
fetchJobs();

// If you want to schedule it at 7 AM every day, uncomment:
// cron.schedule("0 7 * * *", fetchJobs);
