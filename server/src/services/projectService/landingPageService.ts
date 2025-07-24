
import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class LandingPageService extends DeepSeekService {
  async generateLandingPageStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level copywriter and conversion expert with deep knowledge of high-converting landing pages. You specialize in crafting SEO-optimized, emotionally compelling landing pages that drive action. Your writing is persuasive, concise, and structured to guide users toward a clear call-to-action (CTA). You understand the use of urgency, credibility, benefits, and storytelling in direct-response landing page copy. Your output should be clean, fully valid HTML. Response should be start directly from html tag < and end with > html tag, do not response other than HTML`;

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
      `You are tasked with writing a high-converting, SEO-optimized, long-form landing page in pure HTML. Response should be start directly from html tag < and end with > html tag, do not response other than that  `,
      ``,
      `## 🎯 Objective`,
      `Create a persuasive, emotionally engaging landing page that is ready to deploy as-is. This page must be crafted for high conversion rates, strong SEO performance, and reader retention.`,
      ``,
      `## 📌 Output Guidelines`,
      `- Output ONLY valid HTML.`,
      `- Do NOT include any markdown, comments, or intro text.`,
      `- Use ONLY inline styles. DO NOT include <style> tags, CSS classes, or external stylesheets.`,
      `- Structure the content into clearly defined sections:`,

      `  1. <body> section with:`,
      `     - <h1> main headline using a powerful hook and keyword.`,
      `     - do not include any <img> tags`,
      `     - <p> subheading with persuasive, benefit-driven intro.`,
      `     - <ul> or <ol> listing at least 5 product/service benefits.`,
      `     - A testimonial section using <blockquote> or styled <div> with full name and city.`,
      `     - A 3-step consumption or usage guide.`,
      `     - A highlighted offer section emphasizing discount and bonus.`,
      `     - A long-form persuasive section elaborating on pain points, transformation, and credibility.`,
      `     - Two strong <a> or <button>-styled CTA links.`,
      `     - A final call-to-action paragraph.`,
      ``,
      `## ✍️ Tone & Writing Style`,
      `- Copy should be friendly, conversational, yet authoritative.`,
      `- Blend storytelling and benefits to make it emotionally resonant.`,
      `- Use formatting like <strong>, inline <style>, spacing, and visual emphasis to guide the reader's attention.`,
      `- Use natural keyword insertion for SEO.`,
      ``,
      `## 📥 Input Data`,
      `Use the following structured data to build the content, adjust tone, and insert appropriate values throughout the page.`,
      ``,
      `### Category Values`,
      `${formattedCategoryInputs}`,
      ``,
      `### Blueprint Details`,
      `${formattedBlueprint}`,
      ``,
      `---`,
      `Generate one complete inline-styled HTML landing page with all the above requirements. Make the content rich, structured, and longer than average landing pages to improve quality and engagement.`,
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

export const landingPageService = new LandingPageService()