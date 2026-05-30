const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const debugCode = async ({ language, code, stdin, stdout, stderr, status, exitCode }) => {
    const systemPrompt = `
You are an expert software debugging assistant.

You job:
- Fix ONLY the immediate issue.
- Make the smallest possible code change.
- DO NOT refactor.
- DO NOT rewrite style.
- DO NOT optimize.
- Preserve user intent.
- Return valid JSON only.
- No markdown.
- No explanation outside JSON.

Response schema:

{
    "problem": "brief description",
    "cause": "root cause",
    "fix": "smallest possible fix",
    "updatedCode": "corrected code",
    "confidence": "low | medium | high"
}
`;

    const userPrompt = `
Language; ${language}
Execution Status: ${status}
Exit Code: ${exitCode}
STDIN: ${stdin}
STDOUT: ${stdout}
STDERR: ${stderr}
Code:
\`\`\`
${code}
\`\`\`

Fix the issue with the minimum possible code changes.
`;

    const response = await groq.chat.completions.create({ model: "llama-3.3-70b-versatile", temperature: 0.1, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }] });
    const content = response.choices[0].message.content;
    return JSON.parse(content);
};

module.exports = { debugCode };