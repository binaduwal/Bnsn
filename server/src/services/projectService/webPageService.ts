

import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class WebPageService extends DeepSeekService {

async generateHomePageStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void,
  homepageReference?: string
): Promise<string> {
  const systemPrompt = `You are a senior website UX/copywriting expert specializing in building complete home pages for modern websites. You write SEO-friendly, emotionally engaging, navigational HTML pages. The page must be structured like a real home page — introducing the brand, summarizing offerings, and guiding users to other pages. Your output must be valid inline-styled HTML, starting with <html> and ending with </html> and content must be inside <body> tag.`;

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
    `You are tasked with writing a professional and navigable **Home Page** in valid HTML for a company or brand.`,

    `## 🎯 Objective`,
    `Create a clean, SEO-optimized home page in inline-styled HTML that introduces the company, summarizes the main features or offerings, includes trust-building content, and guides visitors to explore more.`,

    `## 📌 Output Rules`,
    `- Output ONLY valid HTML.`,
    `- Use ONLY inline styles.`,
    `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
    `- Use no <img> tags.`,
    `- Output must start with <html> and end with </html>.`,
    `- Make sure it's structured like a proper home page.`,

    `## 🧱 Home Page Structure`,
    `1. <header> with company name and top navigation links (e.g., Home, Features, About, Contact).`,
    `2. <section> Hero section with headline and subheadline.`,
    `3. <section> Features overview (3-5 key features or services).`,
    `4. <section> About the company or mission.`,
    `5. <section> Testimonials section (1–2 trust quotes).`,
    `6. <section> CTA block inviting users to take action (e.g., Explore, Book Now, Get Started).`,
    `7. <footer> with navigation and contact information.`,

    `## ✍️ Tone & Style`,
    `- Clear, welcoming, and professional.`,
    `- Benefit-driven but informative.`,
    `- Use <strong>, <h1>–<h3>, <ul>, <p> for structure and emphasis.`,
    `- Use inline styling for layout, spacing, typography, and colors.`,

    `## 📥 Provided Input`,
    `### Category Values`,
    `${formattedCategoryInputs}`,

    `### Blueprint Details`,
    `${formattedBlueprint}`,

    `---`,
    `Now generate a complete inline-styled HTML document for the home page using the structure above.`
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

async generateAboutCeoPageStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void,
  homepageReference?: string
): Promise<string> {
  const systemPrompt = `You are a professional web copywriter with expertise in writing engaging and credible "About the CEO" pages for modern brands. You specialize in SEO-optimized, emotionally engaging storytelling that builds connection and trust with visitors. Your output must be clean, valid inline-styled HTML that starts with <html> and ends with </html> and all the content must be inside <body> tag.`;

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

  // Add homepage styling reference if available
  const stylingReference = homepageReference ? 
    `\n## 🎨 Styling Reference from Homepage
Use the styling patterns from the homepage to maintain visual consistency:
${homepageReference.substring(0, 500)}...` : '';

  const userPrompt = [
    `You are assigned to write a well-structured, SEO-optimized **About the CEO** page using valid HTML.`,

    `## 🎯 Objective`,
    `Create a simple but elegant About the CEO page that introduces the CEO, their background, vision, values, and achievements — in a way that connects with the reader.`,

    `## 📌 Output Rules`,
    `- Output ONLY valid HTML.`,
    `- Use ONLY inline styles.`,
    `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
    `- Do NOT use <img> tags.`,
    `- Output must start with <html> and end with </html>.`,

    `## 🧱 Page Structure`,
    `1. <header> with company name and simple nav (Home | About | Contact).`,
    `2. <section> Hero section with CEO name and a headline.`,
    `3. <section> Background: brief bio, experience, and origin story.`,
    `4. <section> Vision: what drives the CEO and the mission they lead.`,
    `5. <section> Achievements or milestones (bullets or paragraph).`,
    `6. <section> Personal note or quote from the CEO.`,
    `7. <footer> with contact/navigation info.`,

    `## ✍️ Tone & Style`,
    `- Warm, professional, and inspirational.`,
    `- Should humanize the CEO, not sound robotic.`,
    `- Use <h1>–<h3>, <p>, <blockquote>, and <ul> where appropriate.`,
    `- Use inline styles for layout, spacing, colors, and emphasis.`,

    `## 📥 Input Data`,
    `### Category Values`,
    `${formattedCategoryInputs}`,

    `### Blueprint Details`,
    `${formattedBlueprint}`,
    stylingReference,

    `---`,
    `Now generate a fully inline-styled HTML page that introduces the CEO with trust-building copy and structure.`
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

async generateFeaturesPageStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void,
  homepageReference?: string
): Promise<string> {
  const systemPrompt = `You are a senior UX/copy expert specialized in creating Features pages for modern websites. You clearly communicate what makes a product or service powerful, valuable, and unique. You use concise benefit-driven language, avoid jargon, and format for easy reading. Output only valid inline-styled HTML, starting with <html> and ending with </html> and content must be inside <body> tag.`;

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
    `Write a clean, SEO-friendly Features page in inline HTML that clearly explains the product or service’s capabilities and advantages.`,

    `## 🎯 Objective`,
    `Create a Features page that explains what the product does, how it works, and why it’s better — structured with clarity and persuasion.`,

    `## 📌 Output Rules`,
    `- Output ONLY valid HTML.`,
    `- Use ONLY inline styles.`,
    `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
    `- Do NOT use <img> tags.`,
    `- Output must start with <html> and end with </html>.`,

    `## 🧱 Features Page Structure`,
    `1. <header> with navigation (Home, Features, Pricing, Contact).`,
    `2. <section> Hero: Headline and subheadline introducing the product/service.`,
    `3. <section> Core Features: List 5–7 features with short descriptions.`,
    `4. <section> Benefits vs Competitors (what makes it unique).`,
    `5. <section> How it works / usage flow (steps or bullet points).`,
    `6. <section> CTA inviting users to explore, try, or get started.`,
    `7. <footer> with basic contact info and links.`,

    `## ✍️ Tone & Style`,
    `- Clear, confident, and benefit-driven.`,
    `- Avoid fluff, focus on clarity and value.`,
    `- Use <h1>–<h3>, <p>, <ul>, and <section> for layout.`,
    `- Use <strong> and inline style for emphasis.`,

    `## 📥 Input`,
    `### Category Values`,
    `${formattedCategoryInputs}`,

    `### Blueprint Details`,
    `${formattedBlueprint}`,

    `---`,
    `Now generate a complete inline-styled Features page in HTML with structure and tone as above.`
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

async generateServicePageStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void,
  homepageReference?: string
): Promise<string> {
  const systemPrompt = `You are an expert web copywriter specializing in creating SEO-optimized, customer-focused service pages for modern websites. Your job is to explain the service clearly, highlight benefits, and encourage action. Use inline-styled valid HTML only. Your response must begin with <html> and end with </html> and content must be inside <body> tag.`;

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
    `Write a professional, persuasive **Service Page** in valid HTML that introduces and explains one or more services provided by a company.`,

    `## 🎯 Objective`,
    `Create an SEO-optimized service page that clearly communicates the value, process, and impact of the service to potential clients or customers.`,

    `## 📌 Output Rules`,
    `- Output ONLY valid HTML.`,
    `- Use ONLY inline styles.`,
    `- Do NOT use CSS classes, <style> tags, or external stylesheets.`,
    `- Do NOT include <img> tags.`,
    `- Start with <html> and end with </html> content must be inside <body> tag.`,

    `## 🧱 Service Page Structure`,
    `1. <header> with basic nav (Home, Services, Contact).`,
    `2. <section> Hero: Clear headline and subheadline about the service.`,
    `3. <section> What we offer: list of 3–5 service features.`,
    `4. <section> Who it's for: description of ideal client or audience.`,
    `5. <section> How it works: step-by-step or process overview.`,
    `6. <section> Why choose us: benefits or differentiators.`,
    `7. <section> CTA with compelling action invite (e.g., Book a Call, Get Started).`,
    `8. <footer> with contact/navigation links.`,

    `## ✍️ Tone & Style`,
    `- Clear, friendly, and confident.`,
    `- Use customer-benefit language.`,
    `- Use <h1>–<h3>, <p>, <ul>, and <section> elements.`,
    `- Use <strong> and inline styles for emphasis.`,

    `## 📥 Details provided by User :-`,
    `${formattedCategoryInputs}`,

    `### Blueprint Details`,
    `${formattedBlueprint}`,

    `---`,
    `Now generate the complete service page in valid inline HTML based on the above instructions.`
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


export const webPageService = new WebPageService()