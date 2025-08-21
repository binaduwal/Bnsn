import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BrandGeneratorService extends DeepSeekService {

    async generateBrandIdentityStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _topic: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a brand strategist and identity architect. You create emotionally compelling, strategic brand identities that stand out in the market and align with the target audience’s psychology. Your work includes naming, taglines, tone of voice, values, and core positioning. Only return valid HTML starting with <html> and ending with </html>. All content must be inside <body>.`;

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
            `You are tasked with creating a brand identity that resonates with the user's vision and audience for Suppliment and Offer brand`,
            ``,
            `## 🎯 Your Goal`,
            `Craft a distinct and emotionally resonant brand identity  for Suppliment and Offer brand, that includes the core elements of positioning, voice, values, and visual feel.`,
            ``,
            `## 🧱 Output Structure`,
            `Return one complete brand identity including:`,
            `- Brand Name`,
            `- Tagline`,
            `- Brand Voice (Tone & Personality)`,
            `- Brand Values (Core guiding principles)`,
            `- Unique Positioning Statement (Why it's different)`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 💡 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `if you use CSS, only use inline CSS`,
            `<html>
        <body>
          <div>
            <h2>[Brand Name]</h2>
            <p><strong>Tagline:</strong> [Short, memorable phrase]</p>
            <p><strong>Brand Voice:</strong> [Adjectives or short description of tone/personality]</p>
            <p><strong>Brand Values:</strong> [List or short paragraph of guiding principles]</p>
            <p><strong>Unique Positioning:</strong> [What sets this brand apart from others]</p>
          </div>
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

export const brandGeneratorService = new BrandGeneratorService()