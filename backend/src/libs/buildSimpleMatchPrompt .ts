export const buildSimpleMatchPrompt = (user: any, jobs: any) => {
    return `
You are an intelligent job-matching assistant. Your task is to compare the user's profile with each job posting and determine how well the user matches each role.

Matching Priorities:
1. User Skills (highest weight) — Compare overlap and relevance with job-required skills.
2. User "About" Section — Analyze context such as experience, interests, and domain fit.
3. Other Fields (secondary) — Use location, job title, and experience for additional accuracy.

Expected Output:
Return only a valid array in a plain text.  
Each item in the array must strictly follow this structure:

[
  {
    "id": "string",           // MongoDB Job ID
    "matchPercent": number,   // integer 0–100
  }
]


Rules:
  Include only jobs with matchPercent ≥ 10.
  If no suitable matches exist, return an empty array: [].
  matchPercent should heavily depend on skill overlap and alignment with the About section.
  Every job provided in the input must be evaluated, even if it’s later excluded (for having <10% match).
  Remember Return only an array as plain text as output.



Input Data:

User Profile:
  Skills: ${user.skills || "N/A"}
  About: ${user.about || "N/A"}

Job Listings:
 ${JSON.stringify(jobs, null, 2)}
`.trim();
};
