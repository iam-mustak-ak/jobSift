import { NextFunction, Request, Response } from "express";
import { convert } from "html-to-text";
import Job from "../models/job.model";
import User from "../models/user.model";
import customError from "../utils/customError";

const ignoredWords = new Set([
    "about", "able", "across", "also", "and", "are", "for", "from",
    "have", "into", "job", "our", "the", "their", "this", "with", "you",
    "your", "years", "year", "work", "working", "experience", "role",
    "team", "teams", "will", "who", "what", "where", "when", "while",
    "that", "than", "them", "they", "has", "had", "use", "using", "used",
    "strong", "excellent", "skills", "skill", "including", "such", "like",
]);

const normalize = (value: unknown) =>
    String(value ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9+#]+/g, " ")
        .trim();

const wordsFrom = (value: unknown) =>
    normalize(value)
        .split(/\s+/)
        .filter((word) => word.length > 2 && !ignoredWords.has(word));

const getExperienceRank = (experience?: string) => {
    const value = normalize(experience);
    if (!value) return undefined;
    if (/\blead|principal|director|executive\b/.test(value)) return 3;
    if (/\bsenior|sr\b/.test(value)) return 2;
    if (/\bmid|intermediate\b/.test(value)) return 1;

    const years = Number(value.match(/\d+(?:\.\d+)?/)?.[0]);
    if (!Number.isFinite(years)) return undefined;
    if (years >= 8) return 3;
    if (years >= 4) return 2;
    if (years >= 2) return 1;
    return 0;
};

const levelRanks: Record<string, number> = {
    entry: 0,
    junior: 0,
    internship: 0,
    mid: 1,
    intermediate: 1,
    senior: 2,
    lead: 3,
    principal: 3,
};

const isSkillMatch = (profileSkill: string, requiredSkill: string) => {
    const aliases: Record<string, string> = {
        reactjs: "react",
        nodejs: "node",
        vuejs: "vue",
        javascript: "js",
        typescript: "ts",
    };
    const canonicalizeSkill = (skill: string) => {
        const compact = normalize(skill).replace(/[^a-z0-9+#]/g, "");
        return aliases[compact] ?? compact;
    };
    if (canonicalizeSkill(profileSkill) === canonicalizeSkill(requiredSkill)) {
        return true;
    }

    const profileWords = wordsFrom(profileSkill);
    const requiredWords = wordsFrom(requiredSkill);
    if (!profileWords.length || !requiredWords.length) return false;
    return requiredWords.every((word) => profileWords.includes(word));
};

const scoreJob = (user: any, job: any) => {
    const profileSkills = (user.skills ?? []).map((skill: unknown) => String(skill));
    const requiredSkills = (job.skillsRequired ?? [])
        .map((skill: any) => typeof skill === "string" ? skill : skill?.name)
        .filter((skill: unknown): skill is string => typeof skill === "string" && Boolean(skill.trim()));

    const aboutText = convert(String(user.about ?? ""), { wordwrap: false });
    const educationText = (user.educations ?? [])
        .map((education: any) => `${education.degree ?? ""} ${education.institution ?? ""}`)
        .join(" ");
    const profileText = [
        user.bio,
        aboutText,
        educationText,
        profileSkills.join(" "),
    ].filter(Boolean).join(" ");
    const profileWords = new Set(wordsFrom(profileText));

    const jobText = [
        job.title,
        job.description ? convert(String(job.description), { wordwrap: false }) : "",
        ...(job.tags ?? []),
        ...requiredSkills,
        ...(job.jobCategory ?? []).map((category: any) => category?.name ?? ""),
    ].join(" ");
    const jobWords = new Set(wordsFrom(jobText));

    let totalWeight = 0;
    let weightedScore = 0;
    const reasons: string[] = [];
    const matchedSkills = requiredSkills.filter((required: string) =>
        profileSkills.some((profileSkill: string) => isSkillMatch(profileSkill, required))
    );

    if (profileSkills.length && requiredSkills.length) {
        const skillScore = matchedSkills.length / requiredSkills.length;
        totalWeight += 0.5;
        weightedScore += skillScore * 0.5;
        if (matchedSkills.length) {
            reasons.push(`Matches ${matchedSkills.length} of ${requiredSkills.length} required skills`);
        }
    }

    const candidateExperienceRank = getExperienceRank(user.experience);
    const jobExperienceRank = levelRanks[normalize(job.experienceLevel)];
    if (candidateExperienceRank !== undefined && jobExperienceRank !== undefined) {
        const experienceScore = candidateExperienceRank >= jobExperienceRank
            ? 1
            : Math.max(0.15, 1 - (jobExperienceRank - candidateExperienceRank) * 0.4);
        totalWeight += 0.15;
        weightedScore += experienceScore * 0.15;
        if (experienceScore >= 0.7) reasons.push("Fits your experience level");
    }

    const preferredLocation = user.jobPreferences?.preferredLocation || user.location;
    const jobLocation = normalize(job.location);
    const isRemote = /\bremote\b/.test(normalize(job.employmentMode) + " " + jobLocation);
    if (preferredLocation && (jobLocation || isRemote)) {
        const candidateLocation = normalize(preferredLocation);
        const locationMatches = Boolean(
            candidateLocation &&
                jobLocation &&
                (jobLocation.includes(candidateLocation) || candidateLocation.includes(jobLocation))
        );
        const locationScore = locationMatches ? 1 : isRemote ? 0.85 : 0.1;
        totalWeight += 0.15;
        weightedScore += locationScore * 0.15;
        if (locationMatches) reasons.push("Matches your preferred location");
        else if (isRemote) reasons.push("Remote work may fit your location preference");
    }

    const preferredJobType = normalize(user.jobPreferences?.jobType).replace(/\s+/g, "-");
    const jobType = normalize(job.jobType).replace(/\s+/g, "-");
    if (preferredJobType && jobType) {
        const typeMatches = preferredJobType === jobType;
        totalWeight += 0.1;
        weightedScore += (typeMatches ? 1 : 0.1) * 0.1;
        if (typeMatches) reasons.push("Matches your preferred job type");
    }

    const expectedSalary = Number(user.jobPreferences?.expectedSalary);
    const salaryMax = Number(job.salaryRange?.max);
    if (expectedSalary > 0 && Number.isFinite(expectedSalary) && salaryMax > 0) {
        const salaryScore = salaryMax >= expectedSalary
            ? 1
            : Math.max(0, salaryMax / expectedSalary);
        totalWeight += 0.05;
        weightedScore += salaryScore * 0.05;
        if (salaryScore === 1) reasons.push("Salary range meets your expectation");
    }

    if (profileWords.size && jobWords.size) {
        const commonWords = [...profileWords].filter((word) => jobWords.has(word));
        const textScore = Math.min(1, commonWords.length / Math.min(profileWords.size, 12));
        totalWeight += 0.1;
        weightedScore += textScore * 0.1;
        if (commonWords.length >= 2) reasons.push("Related to your profile and background");
    }

    const matchPercent = totalWeight
        ? Math.round((weightedScore / totalWeight) * 100)
        : 0;

    return {
        matchPercent,
        matchReasons: reasons.slice(0, 3),
        matchedSkills,
    };
};

export const matchJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id?: string } | undefined;
        if (!authUser?._id) {
            return next(customError(401, "Authentication required"));
        }

        const user = await User.findById(authUser._id).select("-password").lean();
        if (!user) return next(customError(404, "User not found"));

        const now = new Date();
        const appliedJobIds = (user.appliedJobs ?? []).map((entry: any) => entry.jobId);
        const jobs = await Job.find({
            isPublished: true,
            isDraft: { $ne: true },
            isActive: true,
            _id: { $nin: appliedJobIds },
            $or: [
                { deadline: { $exists: false } },
                { deadline: null },
                { deadline: { $gt: now } },
            ],
        })
            .populate("company", "name logo website")
            .populate("recruiter", "name")
            .populate({ path: "skillsRequired", select: "name" })
            .populate({ path: "jobCategory", select: "name" })
            .select("title description jobType employmentMode location salaryRange experienceLevel company recruiter skillsRequired jobCategory openings deadline isActive tags createdAt")
            .sort({ createdAt: -1 })
            .limit(500)
            .lean<any[]>();

        const profileSignals = {
            skills: Boolean(user.skills?.length),
            experience: Boolean(user.experience),
            location: Boolean(user.location || user.jobPreferences?.preferredLocation),
            preferences: Boolean(user.jobPreferences?.jobType || user.jobPreferences?.expectedSalary),
            background: Boolean(user.about || user.bio || user.educations?.length),
        };
        const signalLabels: Record<keyof typeof profileSignals, string> = {
            skills: "Skills",
            experience: "Experience level",
            location: "Location",
            preferences: "Job preferences",
            background: "About and education",
        };
        const usedProfileSignals = (Object.keys(profileSignals) as (keyof typeof profileSignals)[])
            .filter((signal) => profileSignals[signal])
            .map((signal) => signalLabels[signal]);
        const missingProfileDetails = (Object.keys(profileSignals) as (keyof typeof profileSignals)[])
            .filter((signal) => !profileSignals[signal])
            .map((signal) => signalLabels[signal]);

        const matches = jobs
            .map((job) => ({
                ...job,
                ...scoreJob(user, job),
            }))
            .filter((job) => job.matchPercent >= 20)
            .sort((a, b) => b.matchPercent - a.matchPercent)
            .slice(0, 50);

        const completedSignals = usedProfileSignals.length;
        const profileReadiness = Math.round((completedSignals / 5) * 100);

        res.status(200).json({
            success: true,
            message: "Personalized job suggestions generated successfully",
            data: matches,
            meta: {
                profileId: user._id.toString(),
                profileReadiness,
                hasProfileSignals: completedSignals > 0,
                usedProfileSignals,
                missingProfileDetails,
                jobsConsidered: jobs.length,
            },
        });
    } catch (err) {
        next(err);
    }
};
