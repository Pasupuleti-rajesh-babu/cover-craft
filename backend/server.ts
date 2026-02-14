import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Input validation schema
const generateSchema = z.object({
    jdText: z.string().min(2),
    resumeText: z.string().min(2),
    tone: z.enum(['Neutral', 'Confident', 'Warm']).optional().default('Neutral'),
    apiKey: z.string().optional(),
});

// POST /generate
app.post('/api/generate', async (req: Request, res: Response): Promise<void> => {
    try {
        const { jdText, resumeText, tone, apiKey } = generateSchema.parse(req.body);

        const keyToUse = apiKey || process.env.GEMINI_API_KEY;

        if (!keyToUse) {
            res.status(400).json({ error: 'API Key is required. Please enter it in the settings or configure it on the server.' });
            return;
        }

        const genAI = new GoogleGenerativeAI(keyToUse);
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);

        res.json({ coverLetter: data.coverLetter, company: data.company });
    } catch (error) {
        console.error('Generation error:', error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: (error as any).errors });
        } else {
            res.status(500).json({ error: 'Failed to generate cover letter' });
        }
    }
});

// POST /export-docx
app.post('/api/export-docx', async (req: Request, res: Response): Promise<void> => {
    try {
        const { coverLetterText } = req.body;

        if (!coverLetterText) {
            res.status(400).json({ error: 'Cover letter text is required' });
            return;
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: coverLetterText.split('\n').map((line: string) => {
                    // meaningful paragraphs
                    if (line.trim() === '') return new Paragraph({});
                    return new Paragraph({
                        children: [new TextRun({ text: line, size: 24 })], // 12pt font
                        spacing: { after: 200 }
                    });
                }),
            }],
        });

        const buffer = await Packer.toBuffer(doc);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=cover-letter.docx');
        res.send(buffer);

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export DOCX' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
