import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BooksIdeaService extends DeepSeekService {

    async generateBookIdeasStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a creative book strategist and high-concept idea generator. You understand genres, tropes, audience psychology, and storytelling structure. You come up with original, compelling book ideas that are marketable and emotionally resonant. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

        const formattedBlueprint = blueprintValue
            .map((section) => {
                const values = section.values
                    .map((val) => `- ${val.key}: ${val.value}`)
                    .join("\n");
                return `### ${section.title}\n${values}`;
            })
            .join("\n\n");

        const formattedCategoryInputs = projectCategoryValue
            .map((item) => `- ${item.key}: ${item.value}`)
            .join("\n");

        const userPrompt = [
            `You are tasked with generating powerful, unique book ideas based on the user's creative blueprint.`,
            ``,
            `## 📘 Your Goal`,
            `Generate book ideas that stand out in the market, resonate emotionally with the target reader, and align with the provided blueprint.`,
            ``,
            `## 📚 Output Structure`,
            `Return 3 book ideas, each with the following details:`,
            `- Title`,
            `- Genre`,
            `- Hook/Concept (1–2 sentence idea)`,
            `- Target Reader`,
            `- Why It Will Sell (based on current trends or unmet needs)`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 💡 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `<html>
            <body>
            <div class="book-idea">
      <h2>[Book Title]</h2>
      <p><strong>Genre:</strong> [Genre]</p>
      <p><strong>Hook:</strong> [High-concept summary]</p>
      <p><strong>Target Reader:</strong> [Who it’s for]</p>
      <p><strong>Why It Will Sell:</strong> [Market justification]</p>
    </div>
    <div class="book-idea">...</div>
    <div class="book-idea">...</div>
            </body>
            </html>`,
            ``,
            `Only return HTML. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.92,
            max_tokens: 1100,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
}


export const booksIdeaService = new BooksIdeaService()