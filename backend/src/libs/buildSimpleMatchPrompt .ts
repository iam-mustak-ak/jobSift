export const buildSimpleMatchPrompt = (user: any, jobs: any[]) => {
    return `
You are a job matching assistant. Compare the user's profile with each job's description and required skills.

Focus on the following user attributes for matching priority:
1. User skills (array of skills) — heavily influence matchPercent.
2. User "about" section — provides context about experience, interests, and preferences.
3. Other fields (e.g., location, title, experience) can be used secondarily.

Return ONLY a JSON ARRAY. Each item must follow this format:
{
  "_id": string,          // Job ID
  "matchPercent": number,  // 0-100
  "reason": string        // Explanation
}

User Profile (priority fields):
Skills: """${JSON.stringify(user.skills)}"""
About: """${user.about}"""

Jobs:
"""${JSON.stringify(jobs)}"""

Make sure:
- Each job in the array has a corresponding JSON object.
- The JSON is valid and parsable.
- matchPercent is heavily based on skill overlap and relevance to the "about" section.
- Reason explains why the matchPercent is high or low, referencing skills and "about".
- Only include jobs with matchPercent >= 10. Jobs with matchPercent < 10 should be excluded.
- If no match, do not include the job in the array.

Always return a JSON ARRAY even if there's only one job.
`.trim();
};
