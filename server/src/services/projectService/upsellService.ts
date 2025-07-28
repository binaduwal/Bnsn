import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class UpsellService extends DeepSeekService {

    async generateUpsellIdeasStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
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

    async generateBookFunnelUpsellStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a world-class funnel strategist and copywriter who specializes in crafting irresistible upsell offers for book funnels. Your task is to create a high-converting upsell pitch that seamlessly follows the initial book offer. Write in persuasive, emotionally resonant language. Format the output in clean HTML, starting with <html> and ending with </html>. Contents must be inside <body> tag`;

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
            `## ✍️ Your Task`,
            `Write a compelling **book funnel upsell offer** that will be shown immediately after the user claims the book.`,
            ``,
            `Your goal is to increase Average Order Value (AOV) while staying aligned with the book’s promise and theme.`,
            ``,
            `The upsell could be:`,
            `- A video course that expands on the book`,
            `- A coaching program or private mentorship`,
            `- A toolkit, workbook bundle, or advanced version`,
            `- A membership offer, discount, or exclusive access`,
            ``,
            `Make it enticing, urgent (if needed), but still natural.`,
            ``,
            `## 📘 Book Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## 🧭 details provided by user: `,
            `${formattedCategoryInputs}`,
            ``,
            `## ✅ Output Format`,
            'only use inline CSS',
            `<html>
      <body>
        <div >
          <h2>Special One-Time Offer</h2>
          <p>[High-converting upsell pitch here]</p>
          <p><strong>Act now</strong> — this offer won't be available again!</p>
        </div>
      </body>
    </html>`,
            ``,
            `Only return HTML. Do not include markdown or extra commentary.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.9,
            max_tokens: 1500,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

}


export const upsellService = new UpsellService()