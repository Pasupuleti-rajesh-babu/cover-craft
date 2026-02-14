import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GenerateResult {
    coverLetter: string;
    company: string;
}

export const generateCoverLetter = async (
    apiKey: string,
    jdText: string,
    resumeText: string,
    tone: string
): Promise<GenerateResult> => {
    if (!apiKey) throw new Error("API Key is required");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert career coach and professional writer.
      
      Analyze the following Job Description to identify the **Job Title** and **Company Name**.
      If they are not explicitly stated, infer them or use generic placeholders.
      
      Then, write a compelling, human-sounding cover letter for this role.
      
      Job Description:
      ${jdText}
      
      Resume:
      ${resumeText}
      
      Tone: ${tone}
      
      Requirements:
      1. Write clear, strong paragraphs. No bullet points.
      2. No placeholders like "[Name]" or "[Date]".
      3. Focus on skills from the resume that match the JD.
      4. Avoid clichés.
      5. Keep it concise (approx 300-400 words).
      
      **Output Format**:
      Return a STRICT JSON object with no markdown formatting.
      {
        "company": "Company Name inferred from JD",
        "coverLetter": "The full body of the cover letter..."
      }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanText);

        return {
            coverLetter: data.coverLetter,
            company: data.company || "Company",
        };
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate cover letter. Please checks your API key and try again.");
    }
};
