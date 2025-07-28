
import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

 class LandingPageService extends DeepSeekService {
  async generateLandingPageStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void,
    homepageReference?: string
  ): Promise<string> {
    const systemPrompt = `You are a senior-level copywriter and conversion expert specializing in high-converting landing page content. You create persuasive, emotionally compelling content that drives action. Your output must be clean, valid inline-styled HTML that starts with <html> and ends with </html> and content must be inside <body> tag.`;

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
      `You are tasked with creating high-converting, SEO-optimized landing page content in clean HTML format.`,
      ``,
      `## 🎯 Objective`,
      `Create persuasive, emotionally engaging landing page content that is ready to be embedded in web applications. This content must be crafted for high conversion rates, strong SEO performance, and reader retention.`,
      ``,
      `## 📌 CRITICAL OUTPUT REQUIREMENTS`,
      `- Output ONLY valid HTML.`,
      `- Use ONLY inline styles.`,
      `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
      `- Do NOT use <img> tags.`,
      `- Output must start with <html> and end with </html>.`,
      `- Make sure it's structured like a proper landing page.`,
      ``,
      `## 🧱 Landing Page Structure`,
      `1. <header> with company name and simple navigation.`,
      `2. <section> Hero section with powerful headline and subheadline.`,
      `3. <section> Benefits overview (3-5 key benefits).`,
      `4. <section> Testimonials section (1-2 trust quotes).`,
      `5. <section> How it works (3-step process).`,
      `6. <section> Offer details with bonuses and guarantees.`,
      `7. <section> Persuasive content about pain points and transformation.`,
      `8. <section> Multiple CTA buttons with urgency and benefits.`,
      `9. <footer> with contact information and navigation.`,
      ``,
      `## ✍️ Tone & Style`,
      `- Clear, persuasive, and emotionally engaging.`,
      `- Benefit-driven with strong calls-to-action.`,
      `- Use <h1>–<h3>, <p>, <ul>, <section> for structure.`,
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
      `Now generate a complete inline-styled HTML document for the landing page using the structure above.`,
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