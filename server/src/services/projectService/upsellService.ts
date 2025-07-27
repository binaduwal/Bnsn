import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class UpsellService extends DeepSeekService {

    async generateUpsellIdeasStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a conversion strategist and upsell architect. You specialize in designing strategic, relevant, and irresistible upsells that increase average order value without breaking customer trust. You understand buyer intent, offer psychology, and complementary product creation. Only return valid HTML starting with <html> and ending with </html>. All content must be inside <body>.`;

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
            `You are tasked with creating strategic upsell ideas based on the user's offer and market.`,
            ``,
            `## 🎯 Your Goal`,
            `Generate 3 tailored upsell offers that naturally extend or enhance the main product/service while maximizing conversions.`,
            ``,
            `## 📈 Output Structure`,
            `Each upsell idea must include:`,
            `- Upsell Title`,
            `- Type (Upgrade, Add-on, Bundle, Recurring, Premium Access, etc.)`,
            `- Description (What it is, how it helps, and why it's a no-brainer)`,
            `- Why It Converts (Psychological trigger or strategic reason it increases revenue)`,
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
      <div class="upsell-idea">
        <h2>[Upsell Title]</h2>
        <p><strong>Type:</strong> [Upgrade / Add-on / Subscription / etc.]</p>
        <p><strong>Description:</strong> [What the upsell is and how it benefits the customer]</p>
        <p><strong>Why It Converts:</strong> [Conversion logic or psychological angle]</p>
      </div>
      <div class="upsell-idea">...</div>
      <div class="upsell-idea">...</div>
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
            temperature: 0.9,
            max_tokens: 1100,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
}


export const upsellService = new UpsellService()