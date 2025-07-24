import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class PressReleaseService extends DeepSeekService {

     async generatePressReleaseStream(
       blueprintValue: BlueprintValue[],
       projectCategoryValue: ProjectCategoryValue[],
       onProgress?: (chunk: string) => void
     ): Promise<string> {
       const systemPrompt = `You are a professional press release writer with expertise in media communication, journalism, public relations, and brand storytelling. You write authoritative, compelling, and newsworthy press releases that grab media attention, establish credibility, and drive traffic to businesses. Your tone is formal yet engaging, suitable for both media outlets and direct consumer readers. Your releases are structured to follow journalistic standards and include factual, benefit-driven messaging.`;
     
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
         `## 📢 Press Release Objective`,
         `The press release should be structured to attract media outlets, build credibility, and drive attention to a business initiative, launch, partnership, or announcement.`,
         ``,
         `## 🧩 Provided Inputs`,
         `Below are the contextual values provided by the user. Use these to determine the angle, tone, and details to include in the press release.`,
         ``,
         `${formattedCategoryInputs}`,
         ``,
         `## 👤 Author Information`,
         `${formattedBlueprint}`,
         ``,
         `---`,
         ``,
         `Please generate a full-length press release with these instructions:`,
         ``,
         `- Use <html>, <body>, <div>, <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <a> where appropriate.`,
         `- The press release title should be in <h1> and contain a clear benefit or newsworthy announcement.`,
        //  `- Start with a dateline (e.g., <p><strong>San Francisco, CA – July 24, 2025</strong></p>).`,
         `- The lead paragraph should summarize the main announcement clearly and compellingly.`,
         `- Follow with detailed supporting paragraphs, including quotes (from CEO or stakeholders), stats, background info, and relevant benefits.`,
         `- Include a brief boilerplate ("About [Company]") section near the end.`,
         `- Conclude with press contact information.`,
         `- DO NOT include markdown or explanations. Output valid HTML only.`,
         `- Separate multiple press releases using <!-- Press Release 1 --> if applicable.`,
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
 

