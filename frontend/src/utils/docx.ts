import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const generateAndDownloadDocx = async (
    text: string,
    filename: string
): Promise<void> => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: text.split("\n").map((line) => {
                    if (line.trim() === "") return new Paragraph({});
                    return new Paragraph({
                        children: [new TextRun({ text: line, size: 24 })], // 12pt font
                        spacing: { after: 200 },
                    });
                }),
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
