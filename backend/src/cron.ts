import axios from "axios";
import dotenv from "dotenv";
import nodeCron from "node-cron";
import Company from "./models/company.model";
import Job from "./models/job.model";
import JobCategory from "./models/jobCategory.model";
import Skill from "./models/skill.model";

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
        await getAndCreateCompanies(allJobs);
        await getAndCreateJobs(allJobs);

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

const getAndCreateCompanies = async (allJobs: any[]) => {
    try {
        for (const job of allJobs) {
            if (!job.company) continue;
            const name = job.company.name?.trim();
            if (!name) continue;

            const existingCompany = await Company.findOne({ name });
            if (existingCompany) continue;

            const data = job.company;

            const socials = [
                {
                    platform: "LinkedIn",
                    url: data.linkedinUrl,
                },
            ];

            const newCompany = new Company({
                name,
                description: data.linkedinDescription,
                website: data.website,
                size: data.linkedinSize,
                socialLinks: socials,
                foundedYear: data.linkedinFounded,
                industry: data.linkedinIndustry,
                location:
                    Array.isArray(data?.linkedinLocations) &&
                    data.linkedinLocations.length > 0
                        ? data.linkedinLocations[0]
                        : "",
            });

            await newCompany.save();
        }
        console.log("Companies saved");
    } catch (error) {
        console.error("Error saving Companies:", error);
    }
};

const levels = ["entry", "mid", "senior", "lead"];

const getAndCreateJobs = async (allJobs: any[]) => {
    try {
        for (const job of allJobs) {
            if (!job.id) continue;

            const existingJob = await Job.findOne({ jobId: job.id });
            if (existingJob) continue;

            const categoryNames: string[] = Array.isArray(job.categories)
                ? job.categories.filter((c: any) => typeof c === "string")
                : [];

            const categoriesInDb = categoryNames.length
                ? await JobCategory.find({ name: { $in: categoryNames } })
                : [];
            const categoryIds = categoriesInDb.map((cat) => cat._id);

            const skillNames: string[] = Array.isArray(job.skills)
                ? job.skills.filter((s: any) => typeof s === "string")
                : [];

            const skillsInDB = skillNames.length
                ? await Skill.find({ name: { $in: skillNames } })
                : [];
            const skillsName = skillsInDB.map((skill) => skill.name);
            const skillIDS = skillsInDB.map((skill) => skill._id);

            const companyName = job.company?.name?.trim();
            if (!companyName) continue;

            const findCompany = await Company.findOne({ name: companyName });
            if (!findCompany) continue;

            const type =
                Array.isArray(job?.employmentTypes) &&
                job.employmentTypes.length > 0
                    ? job.employmentTypes[0].toLowerCase()
                    : "full-time";

            const mode =
                Array.isArray(job?.locationTypes) &&
                job.locationTypes.length > 0
                    ? job.locationTypes[0].toLowerCase()
                    : "onsite";

            const minSalary = Math.floor(
                Math.random() * (80000 - 30000) + 30000
            );
            const maxSalary = Math.floor(
                Math.random() * (150000 - (minSalary + 10000)) +
                    (minSalary + 10000)
            );
            const salaryRange = { min: minSalary, max: maxSalary };

            const experienceLevel =
                levels[Math.floor(Math.random() * levels.length)];

            const newJobPayload: any = {
                jobId: job.id,
                title: job.title,
                description: job.description,
                jobType: type,
                url: job.url,
                employmentMode: mode,
                location: job?.location || "",
                salaryRange,
                experienceLevel,
                company: findCompany._id,
                jobCategory: categoryIds,
                openings: job.datePosted || new Date(),
                isActive: job.dateDeleted !== null ? false : true,
                isFeatured: false,
                tags: skillsName,
                isPublished: true,
            };

            if (skillIDS.length > 0) {
                newJobPayload.skillsRequired = skillIDS;
            }

            const newJob = new Job(newJobPayload);
            await newJob.save();
        }

        console.log("Jobs saved");
    } catch (error) {
        console.error("Error saving Jobs:", error);
    }
};

// If you want to schedule it at 7 AM every day, uncomment:
nodeCron.schedule("0 7 * * *", fetchJobs);

// fetchJobs();
