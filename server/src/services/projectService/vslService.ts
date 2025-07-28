

import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class VslPageService extends DeepSeekService {
     async generateVSLScriptStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level direct response copywriter trained in Jon Benson's VSL structure. Your job is to write long-form Video Sales Letter (VSL) scripts that convert cold traffic into buyers. The tone is persuasive, emotional, and structured for maximum attention, trust, and action. Response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>.`;

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
      `Write a complete, emotionally-driven, long-form HTML Video Sales Letter (VSL) script.`,
      ``,
      `## 🎯 Objective`,
      `This VSL should be capable of supporting a 25–45 minute spoken video designed to convert cold traffic.`,
      ``,
      `## 💡 Style Requirements`,
      `- Start with a raw, relatable backstory (that is in the values submitted by User) that builds empathy and authority.`,
      `- Then follow Jon Benson's 11-stage VSL framework (listed below).`,
      `- Use direct, natural, conversational copy — no corporate jargon or fluff.`,
      ``,
      `## ✅ Output Format`,
      `- Response must start with <html> and end with </html>`,
      `- All content must be inside <body> tags`,
      `- Use <h1>, <h2>, <p>, <strong>, <em>, <ul>, and <a> appropriately`,
      `- Use only inline CSS`,
      `- NO <img>, <video>, or script tags`,
      `- NO markdown, explanations, or comments`,
      `- Do NOT include any intro text or explanations - start directly with <html>`,
      ``,
      `## 🧱 Structure (Jon Benson's VSL Framework)`,
      `1. Pattern Interrupt / Shocking Opening`,
      `2. Agitate The Problem`,
      `3. Personal Story & Relatable Transformation (Hero's Journey Style)`,
      `4. Introduce The Unique Shift / Method`,
      `5. Present The Core Solution`,
      `6. Stack The Benefits / Social Proof`,
      `7. Overcome Objections & Inject Urgency`,
      `8. Stack The Value`,
      `9. Offer Guarantee`,
      `10. Create Scarcity / Limited-Time Bonus`,
      `11. Final Call-To-Action`,
      ``,
      `## 📋 Requirements:`,
      `- Generate exactly 1 complete VSL script`,
      `- Use Valid HTML Elements <html> <body>`,
      `- Only use inline css`,
      `- Use proper spacing and styling to make UI look better`,
      `- Only return valid HTML. No markdown, no intro text, no explanations`,
      ``,
      `Below are important context values submitted by the user. Use them to generate the VSL.`,
      ``,
      `## 📥 User submitted Input Data`,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Brand Voice & Messaging`,
      `${formattedBlueprint}`,
      ``,
      `Your response must be clean HTML blocks only. No markdown. No extra explanation.`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 4000,
      temperature: 0.75,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

}

export const vslPageService = new VslPageService()