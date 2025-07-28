
import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class OrderBumpsService extends DeepSeekService {
async generateOrderBumpCopyStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title:string,
    onProgress?: (chunk: string) => void
): Promise<string> {
    const systemPrompt = `You are a top-tier direct response copywriter who specializes in crafting high-converting order bump offers for checkout pages. Your copy is concise, emotionally persuasive, and formatted for maximum conversions. Always return a complete HTML document starting with <html> and ending with </html>. All content must be wrapped inside <body>.`;

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
        `You are tasked with generating short, persuasive order bump copy that can be shown on a checkout page to increase average order value.`,
        ``,
        `## 🛒 Strategy`,
        `- The copy should be 100–200 words max.`,
        `- Hook readers with a headline, deliver emotional and benefit-driven bullets, and close with a strong CTA.`,
        `- Offer must feel irresistible, urgent, and easy to say yes to.`,
        ``,
        `## 📦 Structure`,
        `1. Headline (benefit or curiosity driven)`,
        `2. Subheadline (optional urgency or value emphasis)`,
        `3. 2–4 bullet points (value, benefits, ease, savings)`,
        `4. Call-to-action (checkbox phrasing like "+ Add to my order!")`,
        ``,
        `## Provided Inputs`,
        `${formattedCategoryInputs}`,
        ``,
        `## 💡 Blueprint`,
        `${formattedBlueprint}`,
        ``,
        `## ✅ Output Format`,
        'if you use CSS, only use Inline CSS',
        `<html>
        <body>
        <div>
            <h3>[Headline]</h3>
            <p><em>[Subheadline]</em></p>
            <ul>
                <li>[Benefit Bullet 1]</li>
                <li>[Benefit Bullet 2]</li>
                <li>[Benefit Bullet 3]</li>
            </ul>
            <p><strong>+ Yes! Add this to my order for just $X</strong></p>
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
        temperature: 0.9,
        max_tokens: 900,
    };

    return await this.makeStreamingRequest(request, onProgress);
}
}

export const orderBumpsService = new OrderBumpsService()    