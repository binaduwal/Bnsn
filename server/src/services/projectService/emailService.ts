import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class EmailService extends DeepSeekService {
 // email stream
  async generateEmailStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are an expert email copywriter with deep knowledge of behavioral psychology, marketing funnels, and persuasive writing. You craft high-converting emails for various types such as sales, onboarding, follow-ups, newsletters, cold outreach, and re-engagement. Your goal is to maximize open rates, click-through rates, and conversions — while maintaining a personal, human touch.`;

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
      `You are tasked with writing high-performing marketing emails in HTML format using the structured information below.`,
      ``,
      `## 🎯 Target Audience & Intent`,
      `Use the input to tailor each email's goal and message.`,
      ``,
      `## 📦 Blueprint Content Blocks`,
      `${formattedBlueprint}`,
      ``,
      `## 📝 Additional Context`,
      `${formattedCategoryInputs}`,
      ``,
      `---`,
      ``,
      `Please generate 2 unique and compelling emails following these rules:`,
      ``,
      `- Each email must be in pure HTML format only. Use HTML tags like <html>, <head>, <body>, <h1>, <p>, <a>, <ul>, etc.`,
      `Do not use any kind of placeholder text or meta data. Use the information provided to create the email.`,
      `- Each email should include:`,
      `  - A subject line <!-- Subject: Your Subject Here -->`,
      `  - A preheader text <!-- Preheader: Your preheader here -->`,
      `  - A full email body in HTML with:`,
      `    - A strong hook`,
      `    - Highlighted benefits or offers`,
      `    - Clear, compelling structure (headings, short paragraphs, bullets)`,
      `- Tone: Friendly, persuasive, professional.`,
      `- Each email should be concise yet impactful.`,
      `- Do NOT use markdown or explanations — only return the HTML.`,
      `- Separate emails using <!-- Email X --> comments.`,
      ``,
      `Your response must be clean HTML blocks only. No markdown. No extra explanation.`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true, // Enable streaming
      max_tokens: 4000,
      temperature: 0.7,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }
 
}

export const emailService = new EmailService()