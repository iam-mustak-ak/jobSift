export const buildSimpleMatchPrompt = (user: any, jobs: any[]) => {
    return `
You are a job matching assistant. Compare the user's profile with each job's description and required skills.

Return ONLY a JSON array, where each item has this format:
{
  "jobId": string,
  "matchPercent": number (0-100),
  "reason": string
}

User Profile:
"""${JSON.stringify(user).slice(0, 3000)}"""

Jobs:
"""${JSON.stringify(jobs).slice(0, 5000)}"""

Make sure:
- Each job in the array has a corresponding JSON object.
- The JSON is valid and parsable.
- MatchPercent is based on skill overlap, experience, and relevance.
- Reason explains briefly why the matchPercent is high or low.
    `.trim();
};
