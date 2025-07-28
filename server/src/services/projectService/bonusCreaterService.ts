import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BonusCreaterService extends DeepSeekService {

  async generateBasicBonusIdeasStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a bonus offer strategist and marketing expert. You understand product positioning, digital/physical/service-based products, buyer psychology, and conversion tactics. You craft enticing, relevant bonus ideas that increase perceived value and motivate customers to buy. Response should start directly from <html> and end with </html>, no intro texts, and content must be inside <body>.`;

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
      `You are tasked with creating persuasive bonus offers that complement and elevate the value of a user's product or service.`,
      ``,
      `## 🎯 Your Goal`,
      `Generate 3 creative, relevant bonus ideas that make the main offer irresistible, increase perceived value, and are easy to deliver.`,
      ``,
      `## 💸 Output Structure`,
      `Each bonus idea must include:`,
      `- Bonus Title`,
      `- Type (e.g., eBook, template, consultation, checklist, swipe file, course, private access, free upgrade, etc.)`,
      `- Description (What the bonus is + how it helps the buyer)`,
      `- Why It Converts (Psychological trigger or value rationale)`,
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
          <div class="bonus-idea">
            <h2>[Bonus Title]</h2>
            <p><strong>Type:</strong> [eBook / Consultation / Resource Pack / etc.]</p>
            <p><strong>Description:</strong> [What the bonus is + how it helps the buyer]</p>
            <p><strong>Why It Converts:</strong> [Why this bonus increases conversions]</p>
          </div>
          <div class="bonus-idea">...</div>
          <div class="bonus-idea">...</div>
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

  async generateAdvancedBonusIdeasStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a high-level conversion strategist and bonus architect. You design sophisticated, irresistible bonus stacks that increase perceived value, justify premium pricing, and drive urgency. You understand advanced buyer psychology, scarcity principles, and product-positioning tactics. Response must start directly with <html> and end with </html>. All content must be inside <body>, no external explanation, intro text or markdown.`;

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
      `You are tasked with creating high-impact, value-packed bonus stacks for a premium product or service.`,
      ``,
      `## 🚀 Your Goal`,
      `Generate 3 advanced-level bonus stacks that can be used to justify premium pricing, eliminate objections, and accelerate conversions.`,
      ``,
      `## 🎁 Output Structure`,
      `Each bonus stack must include:`,
      `- Stack Title`,
      `- Total Perceived Value (in $)`,
      `- Strategic Positioning (how this bonus stack supports premium pricing, urgency, or differentiation)`,
      `- Bonus Items (3–5 individual bonuses per stack):`,
      `  - Bonus Title`,
      `  - Type (template, toolkit, VIP access, audit, workshop, etc.)`,
      `  - Description (how it helps the buyer or solves a pain point)`,
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
      <div class="bonus-stack">
        <h2>[Stack Title]</h2>
        <p><strong>Total Perceived Value:</strong> $[Value]</p>
        <p><strong>Strategic Positioning:</strong> [How it supports sales]</p>
        <div class="bonus-item">
          <h3>[Bonus Title]</h3>
          <p><strong>Type:</strong> [Type]</p>
          <p><strong>Description:</strong> [Benefit or problem it solves]</p>
        </div>
        <div class="bonus-item">...</div>
        <div class="bonus-item">...</div>
      </div>
      <div class="bonus-stack">...</div>
      <div class="bonus-stack">...</div>
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
      temperature: 0.94,
      max_tokens: 1400,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

}

export const bonusCreaterService = new BonusCreaterService()