import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class ArticleService extends DeepSeekService {
 

  async generateArticleStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level SEO content writer with expertise in search engine optimization, storytelling, and audience engagement. You write in a human-like tone while ensuring the content is keyword-optimized, informative, and conversion-driven. Your writing balances clarity, depth, and flow, ideal for blogs, knowledge bases, landing pages, and marketing content. Your goal is to produce articles that rank well on Google while delivering genuine value to readers. Response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>.`;

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
      `You are tasked with writing an SEO-optimized, long-form HTML article.`,
      ``,
      `## 🎯 Writing Intent & SEO Context`,
      ``,
      ``,
      `Below are important context values submitted by the user. Use them to shape the tone, audience focus, keyword usage, and structure of the article.`,
      ``,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Author Information`,
      `${formattedBlueprint}`,
      `## 📝 Additional Context`,
      `${formattedCategoryInputs}`,
      ``,
      `---`,
      ``,
      `Please generate 1 full-length article with these instructions:`,
      ``,
      `## ✅ Output Format`,
      `- Response must start with <html> and end with </html>`,
      `- All content must be inside <body> tags`,
      `- Use <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <a> where appropriate`,
      `- Title must be wrapped in <h1> and include at least one Primary Keyword`,
      `- Introduction should hook the reader and align with the intent`,
      `- Include well-structured body sections with subheadings and use keywords contextually`,
      `- Weave in the author backstory and credentials naturally to build authority`,
      `- Wrap up with a strong conclusion and optional CTA`,
      `- DO NOT include markdown or explanations. Output only valid HTML`,
      `- Do NOT include any intro text or explanations - start directly with <html>`,
      ``,
      `## 📋 Requirements:`,
      `- Generate exactly 1 complete article`,
      `- Use Valid HTML Elements <html> <body>`,
      `- Only use inline css`,
      `- Use proper spacing and styling to make UI look better`,
      `- Only return valid HTML. No markdown, no intro text, no explanations`,
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
      temperature: 0.7,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }
  
}

export const articleService = new ArticleService()