import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";
import { generateCurrentDateContext } from "../../utils";

 class PressReleaseService extends DeepSeekService {

     async generatePressReleaseStream(
       blueprintValue: BlueprintValue[],
       projectCategoryValue: ProjectCategoryValue[],
       onProgress?: (chunk: string) => void
     ): Promise<string> {
       const systemPrompt = `You are a professional press release writer with expertise in media communication, journalism, public relations, and brand storytelling. You write authoritative, compelling, and newsworthy press releases that grab media attention, establish credibility, and drive traffic to businesses. Your output must be clean, valid inline-styled HTML that starts with <html> and ends with </html> and content must be inside <body> tag. IMPORTANT: Use current information and trends from 2024-2025. Do not reference outdated data or events from before 2024.`;
     
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
         `You are tasked with writing a professional press release in valid HTML format.`,
         ``,
         `## 🎯 Objective`,
         `Create a professional press release that attracts media outlets, builds credibility, and drives attention to a business initiative, launch, partnership, or announcement.`,
         ``,
         `## 📌 Output Rules`,
         `- Output ONLY valid HTML.`,
         `- Use ONLY inline styles.`,
         `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
         `- Do NOT use <img> tags.`,
         `- Output must start with <html> and end with </html>.`,
         `- Make sure it's structured like a proper press release.`,
         `- Use current date (2024-2025) in datelines and references.`,
         `- Reference current trends, technologies, and market conditions.`,
         generateCurrentDateContext(),
         ``,
         `## 🧱 Press Release Structure`,
         `1. <header> with company name and press release title.`,
         `2. <section> Dateline with location and date.`,
         `3. <section> Lead paragraph with main announcement.`,
         `4. <section> Supporting paragraphs with details, quotes, and benefits.`,
         `5. <section> Boilerplate "About [Company]" section.`,
         `6. <section> Press contact information.`,
         `7. <footer> with additional contact details.`,
         ``,
         `## ✍️ Tone & Style`,
         `- Formal yet engaging, suitable for media outlets.`,
         `- Authoritative and newsworthy.`,
         `- Use <h1>–<h3>, <p>, <blockquote>, <ul> for structure.`,
         `- Use <strong> and inline styles for emphasis.`,
         `- Use inline styling for layout, spacing, typography, and colors.`,
         ``,
         `## 📥 Provided Input`,
         `### Category Values`,
         `${formattedCategoryInputs}`,
         ``,
         `### Blueprint Details`,
         `${formattedBlueprint}`,
         ``,
         `---`,
         `Now generate a complete inline-styled HTML document for the press release using the structure above.`,
       ].join("\n");
     
       const request: DeepSeekRequest = {
         model: this.defaultModel,
         messages: [
           { role: "system", content: systemPrompt },
           { role: "user", content: userPrompt },
         ],
         stream: true,
         max_tokens: 4000,
         temperature: 0.7,
       };
     
       return await this.makeStreamingRequest(request, onProgress);
     }

 }

 export const pressReleaseService = new PressReleaseService()
 

