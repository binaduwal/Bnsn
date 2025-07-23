import axios from "axios";
import { DeepSeekRequest, DeepSeekResponse } from "../types";
import { createError } from "../middleware/errorHandler";
import { ICategory } from "../models/Category";
import "dotenv/config";
import { BlueprintValue, ProjectCategoryValue } from "../types/project";

export class DeepSeekService {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || "";
    this.baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
    this.defaultModel = "deepseek-chat";

    if (!this.apiKey) {
      console.warn(
        "DeepSeek API key not configured. AI features will be disabled."
      );
    }
  }

  private async makeRequest(data: DeepSeekRequest): Promise<DeepSeekResponse> {
    if (!this.apiKey) {
      throw createError("DeepSeek API key not configured", 500);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(
          `DeepSeek API error: ${
            error.response.data?.error?.message || error.response.statusText
          }`,
          error.response.status
        );
      } else if (error.request) {
        throw createError("DeepSeek API is unreachable", 503);
      } else {
        throw createError("Failed to communicate with DeepSeek API", 500);
      }
    }
  }

  async generateBlueprint(
    feedBnsn: string,
    offerType: string,
    categories: ICategory[]
  ): Promise<any> {
    const categoryList = categories.map((cat) => ({
      title: cat.title,
      description: cat.description,
      fields: cat.fields.map((f) => ({
        fieldName: f.fieldName,
        fieldType: f.fieldType,
      })),
    }));

    const systemPrompt = `You are an expert business strategist. You must respond with a JSON array of category objects. Each category object must have:
  - title: string (must match one of the provided categories)
  - description: string
  - fields: array of objects with fieldName and value (which is array of string cause there would be multiple answer of same field) properties
  
  Available categories: ${JSON.stringify(categoryList, null, 2)}
  
  CRITICAL: Return ONLY the JSON array without any markdown formatting, explanations, or code blocks. Start directly with [ and end with ].`;

    const userPrompt = `Create a comprehensive business blueprint for:
  Business Description: ${feedBnsn}
  Offer Type: ${offerType}
  
  Return structured data using the provided categories. Each field should have meaningful content related to the business.
  
  IMPORTANT: Return pure JSON only - no markdown, no explanations, no code blocks.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    let content = response.choices[0]?.message?.content || "";

    // Clean the response to extract JSON
    content = this.cleanJsonResponse(content);

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw AI response:", response.choices[0]?.message?.content);
      return [];
    }
  }

  // Add this helper method to clean the response
  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    content = content.replace(/```json\s*/g, "");
    content = content.replace(/```\s*/g, "");

    // Remove any text before the first [
    const startIndex = content.indexOf("[");
    if (startIndex !== -1) {
      content = content.substring(startIndex);
    }

    // Remove any text after the last ]
    const endIndex = content.lastIndexOf("]");
    if (endIndex !== -1) {
      content = content.substring(0, endIndex + 1);
    }

    // Clean up any remaining whitespace
    content = content.trim();

    return content;
  }

  async generateEmailContent(
    blueprint: any,
    campaignType: string = "promotional"
  ): Promise<string> {
    const systemPrompt = `You are an expert email marketing copywriter. Create compelling email content based on the provided blueprint information.
    Focus on:
    1. Engaging subject lines
    2. Personalized content
    3. Clear call-to-actions
    4. Value-driven messaging
    5. Professional tone that matches the brand`;

    const userPrompt = `Create email campaign content for:
    Campaign Type: ${campaignType}
    Blueprint Data: ${JSON.stringify(blueprint)}
    
    Please provide a complete email with subject line, body content, and call-to-action.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async cloneCopy(
    originalText: string,
    blueprint: string,
    maxWords: number = 2500
  ): Promise<string> {
    const systemPrompt = `You are an expert copywriter specializing in adapting and cloning existing copy while maintaining the original style and effectiveness.
    Your task is to create new copy that:
    1. Maintains the original tone and style
    2. Adapts to the new context provided
    3. Preserves the persuasive elements
    4. Ensures brand consistency
    5. Optimizes for engagement`;

    const userPrompt = `Clone and adapt this copy for a new context:
    
    Original Copy: ${originalText}
    New Context/Blueprint: ${blueprint}
    Maximum Words: ${maxWords}
    
    Please create adapted copy that maintains the original's effectiveness while fitting the new context.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: Math.min(maxWords * 1.5, 3000),
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async suggestImprovements(content: string, context: string): Promise<string> {
    const systemPrompt = `You are an expert content strategist and copywriter. Analyze the provided content and suggest specific improvements.
    Focus on:
    1. Clarity and readability
    2. Persuasiveness and engagement
    3. Call-to-action optimization
    4. Target audience alignment
    5. SEO and conversion optimization`;

    const userPrompt = `Analyze this content and provide specific improvement suggestions:
    
    Content: ${content}
    Context: ${context}
    
    Please provide actionable suggestions for improving this content.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.5,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async analyzeProject(projectData: any): Promise<string> {
    const systemPrompt = `You are an expert business analyst. Analyze the provided project data and provide insights on:
    1. Project strengths and opportunities
    2. Target market analysis
    3. Competitive positioning
    4. Growth strategies
    5. Risk assessment and mitigation`;

    const userPrompt = `Analyze this project and provide strategic insights:
    
    Project Data: ${JSON.stringify(projectData)}
    
    Please provide a comprehensive analysis with actionable recommendations.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateEmail(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[]
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
      `You are tasked with writing  high-performing marketing emails in HTML format using the structured information below.`,
      ``,
      `## 🎯 Target Audience & Intent`,
      `Use the input to tailor each email’s goal and message.`,
      ``,
      `## 📦 Blueprint Content Blocks`,
      `${formattedBlueprint}`,
      ``,
      `## 📝 Additional Context`,
      `${formattedCategoryInputs}`,
      ``,
      `---`,
      ``,
      `Please generate 1 unique and compelling emails following these rules:`,
      ``,
      `- Each email must be in pure HTML format only. Use HTML tags like <html>, <head>, <body>, <h1>, <p>, <a>, <ul>, etc.`,
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

    console.log(JSON.stringify(userPrompt, null, 2));

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      // max_tokens: 2000,
      // temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

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
  async generateArticleStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level SEO content writer with expertise in search engine optimization, storytelling, and audience engagement. You write in a human-like tone while ensuring the content is keyword-optimized, informative, and conversion-driven. Your writing balances clarity, depth, and flow, ideal for blogs, knowledge bases, landing pages, and marketing content. Your goal is to produce articles that rank well on Google while delivering genuine value to readers.`;

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
      `- Use <html>, <head>, <body>, <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <a> where appropriate.`,
      `- Title must be wrapped in <h1> and include at least one Primary Keyword.`,
      `- Introduction should hook the reader and align with the intent.`,
      `- Include well-structured body sections with subheadings and use keywords contextually.`,
      `- Weave in the author backstory and credentials naturally to build authority.`,
      `- Wrap up with a strong conclusion and optional CTA.`,
      `- DO NOT include markdown or explanations. Output only valid HTML.`,
      `- Separate articles using <!-- Article 1 --> if needed.`,
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

  async generateThankYouPageStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level CRO and persuasive copywriting expert. Write fully structured, emotionally engaging, high-converting Thank You pages in pure HTML. These pages should build gratitude, trust, and inspire the next user action (e.g. sharing, repurchasing, referring, engaging). Output must be strictly in HTML — no explanations, markdown, or commentary.`;

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
      `Write a complete, visually compelling HTML Thank You Page.`,
      ``,
      `## 🎯 Purpose`,
      `Display after user takes a successful action (purchase, subscription, etc).`,
      ``,
      `## 🔧 Guidelines`,
      `- Start directly with <html> tag and end with </html>.`,
      `- Use ONLY inline styles. DO NOT include <style> tags, CSS classes, or external stylesheets.`,
      `- Do NOT include any markdown, comments, or intro text.`,
      `- Must be conversion-focused, mobile-responsive, and visually structured.`,
      `- Use <h1>, <h2>, <p>, <ul>, <a>, and CTA buttons for layout.`,
      `- do not include any <img> tags`,
      `- Include follow-up CTA like “Refer a Friend”, “Shop Again”, or “Share Now”.`,
      `- Optionally include a discount code, support link, or bonus.`,
      `- Inject trust (e.g. testimonials, stats) and personalization from inputs.`,
      ``,
      `## 📥 Input Data`,
      `Use the following structured data to build the content, adjust tone, and insert appropriate values throughout the page.`,
      ``,
      `## ✍️ Context`,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Brand Voice`,
      `${formattedBlueprint}`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 3000,
      temperature: 0.75,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

  async generateVSLScriptStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level direct response copywriter trained in Jon Benson's VSL structure. Your job is to write long-form Video Sales Letter (VSL) scripts that convert cold traffic into buyers. The tone is persuasive, emotional, and structured for maximum attention, trust, and action. Output MUST be in valid HTML only, using inline styles. DO NOT include explanations, markdown, comments, or any non-HTML text.`;

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
      `- Then follow Jon Benson’s 11-stage VSL framework (listed below).`,
      `- Use direct, natural, conversational copy — no corporate jargon or fluff.`,
      ``,
      `## 🔧 Output Requirements`,
      `- Must start with html tag and end with  <html> </html> and content must be inside <body> </body>`,
      `- Don't need to implement any CSS, use only minor CSS but inline CSS only `,
      `- Use <h1>, <h2>, <p>, <strong>, <em>, <ul>, and <a> appropriately.`,
      `- NO <img>, <video>, or script tags.`,
      `- NO markdown, explanations, or comments.`,
      ``,
      `## 🧱 Structure (Jon Benson's VSL Framework)`,
      `1. Pattern Interrupt / Shocking Opening`,
      `2. Agitate The Problem`,
      `3. Personal Story & Relatable Transformation (Hero’s Journey Style)`,
      `4. Introduce The Unique Shift / Method`,
      `5. Present The Core Solution`,
      `6. Stack The Benefits / Social Proof`,
      `7. Overcome Objections & Inject Urgency`,
      `8. Stack The Value`,
      `9. Offer Guarantee`,
      `10. Create Scarcity / Limited-Time Bonus`,
      `11. Final Call-To-Action`,
      ``,
      ``,
      `Below are important context values submitted by the user. Use them to generate the VSL.`,
      ``,
      `## 📥 User submitted Input Data`,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Brand Voice & Messaging`,
      `${formattedBlueprint}`,
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

  async generateAdCopyStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level ad copywriter and conversion strategist. You specialize in writing high-converting, emotionally compelling, platform-optimized ad content (Facebook, Instagram, YouTube, TikTok). Your output must be fully valid HTML using only inline styles—no <style> tags, CSS classes, or external stylesheets. Response must begin with <html> and end with </html>. Do not include any other explanation or comments.`;

    const formattedBlueprint = blueprintValue
      .map((section) => {
        const values = section.values
          .map((val) => `- ${val.key}: ${val.value}`)
          .join("\n");
        return `### ${section.title}\n${values}`;
      })
      .join("\n\n");

    const formattedCategoryInputs =
      projectCategoryValue && projectCategoryValue.length > 0
        ? projectCategoryValue
            .map((item) => `- ${item.key}: ${item.value}`)
            .join("\n")
        : undefined;

    const userPrompt = [
      `You are tasked with generating high-converting ad copy inside a single HTML page using ONLY inline styles.`,
      ``,
      `## 📌 Output Rules`,
      `- Output must begin with <html> and end with </html> and all of the content should be inside <body> tag.`,
      `- Use only <div>, <p>, <h1>–<h3>, <strong>, <em>, <ul>, <li>, <a>, and <button> tags.`,
      `- Use inline styles only—no CSS classes, <style> tags, or external links.`,
      `- Do not include images.`,
      `- Do not output anything other than the HTML document.`,
      ``,
      `## 🎯 Content to Include`,
      `Create 4 separate sections within the HTML (each styled for separation and readability):`,
      ``,
      `1. Facebook/Instagram Ad`,
      `   - Hook (h2)`,
      `   - Persuasive Body (p)`,
      `   - CTA (button or a tag)`,
      ``,
      `2. YouTube Ad Script`,
      `   - Hook (h2)`,
      `   - Problem/Desire (p)`,
      `   - Solution (p)`,
      `   - CTA (p or button)`,
      ``,
      `3. TikTok Ad`,
      `   - Hook (h2)`,
      `   - Relatable Scenario (p)`,
      `   - Reveal/Transformation (p)`,
      `   - CTA (strong or button)`,
      ``,
      `4. Final CTA Block`,
      `   - Wrap up all platforms with urgency-driven CTA paragraph and link.`,
      ``,
      `## 🧠 Style & Tone`,
      `- Friendly, emotional, benefit-driven.`,
      `- Use storytelling and emotional resonance.`,
      `- Highlight problem, transformation, urgency.`,
      `- Make it clear, persuasive, and conversion-focused.`,
      ``,
      `## 🧾 Input Data`,
      `### Category Inputs`,
      `${formattedCategoryInputs || ""}`,
      ``,
      `### Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `---`,
      `Now, generate a fully structured HTML document with inline styles. Begin the response ONLY with <html> and end with </html>.`,
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

  private async makeStreamingRequest(
    request: DeepSeekRequest,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(
          `DeepSeek API error: ${response.status} ${response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine === "" || trimmedLine === "data: [DONE]") {
              continue;
            }

            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonData = JSON.parse(trimmedLine.slice(6));

                if (jsonData.choices?.[0]?.delta?.content) {
                  const content = jsonData.choices[0].delta.content;
                  fullContent += content;

                  // Send progress update if callback provided
                  if (onProgress) {
                    onProgress(content);
                  }
                }
              } catch (parseError) {
                console.warn("Failed to parse streaming response:", parseError);
                // Continue processing other chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullContent;
    } catch (error) {
      console.error("Streaming request failed:", error);
      throw new Error(
        `Failed to generate email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateBookDraft(bookData: any): Promise<string> {
    const systemPrompt = `You are a professional book ghostwriter. Based on the provided book data, help structure and write an engaging, coherent book. Focus on clear chapter organization, tone consistency, and value delivery to the reader.`;

    const userPrompt = `Generate a complete book outline and initial content draft:

Book Data: ${JSON.stringify(bookData)}

Provide:
1. Suggested title and subtitle
2. Book outline with chapter breakdown
3. Introduction
4. Sample content for the first 2 chapters (or more depending on book length)

Ensure the tone fits the intended audience and genre. Word count goal: 5,000–50,000 words.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateSalesPageFunnel(funnelData: any): Promise<string> {
    const systemPrompt = `You are an expert direct response marketer and funnel builder. Create a complete high-converting sales funnel that includes Facebook/Instagram ads, a persuasive sales page, and a full email sequence.`;

    const userPrompt = `Generate a full sales funnel for this offer:

Funnel Data: ${JSON.stringify(funnelData)}

Provide:
1. 2-3 Facebook/Instagram ad copies
2. Long-form sales page content with headline, benefits, testimonials, objections, and CTA
3. Email sequence (minimum 3 emails): intro, follow-up, urgency/offer reminder
4. Bonus: upsell ideas or tripwire suggestions

Ensure the funnel flows naturally, addresses objections, and drives conversions.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateLinkedInProfile(profileData: any): Promise<string> {
    const systemPrompt = `You are a professional LinkedIn strategist and personal brand copywriter. Create a LinkedIn profile that attracts leads, highlights personal achievements, and clearly communicates the user’s business value and offer.`;

    const userPrompt = `Generate a high-converting LinkedIn profile based on the following information:

Profile Data: ${JSON.stringify(profileData)}

Include:
1. Headline
2. Summary/About section
3. Experience highlights
4. Featured section suggestions
5. Call-to-action (for DMs or links)

Focus on lead generation and credibility. Use persuasive, concise language that reflects personal and business branding.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1800,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateBookSalesFunnel(funnelData: any): Promise<string> {
    const systemPrompt = `You are a marketing funnel strategist and expert copywriter for self-publishers. Create a complete book sales funnel that includes a compelling back cover, persuasive sales letters, platform-specific ad copy, and other relevant assets to sell the book effectively.`;

    const userPrompt = `Generate a book sales funnel based on this data:

Book Funnel Data: ${JSON.stringify(funnelData)}

Deliverables:
1. Back cover copy
2. Short and long-form sales letters
3. Ad variations for Facebook, Instagram, and Google
4. Call-to-action suggestions
5. Optional: bonus ideas and lead magnets

Tailor everything for book buyers and self-publishing platforms.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateOrderBumpCopy(bumpData: any): Promise<string> {
    const systemPrompt = `You are an expert in conversion-focused copywriting. Craft persuasive, benefit-driven order bump copy that adds irresistible value during the checkout process. Model your language after top-performing checkout pages.`;

    const userPrompt = `Create order bump copy based on the following product/offer details:

Order Bump Data: ${JSON.stringify(bumpData)}

Requirements:
1. Compelling one-liner headline
2. 2–3 short bullet benefits or outcome-driven points
3. A CTA that encourages impulse buy

Tone: persuasive, benefit-focused, and concise. Ideal for checkout upsells.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generatePressRelease(releaseData: any): Promise<string> {
    const systemPrompt = `You are a professional PR writer. Create press releases that follow journalistic standards, build authority, and drive media interest.`;

    const userPrompt = `Write a professional press release using the following information:

Press Release Data: ${JSON.stringify(releaseData)}

Include:
1. Headline and subheadline
2. Opening paragraph with key announcement
3. Supporting details and quotes
4. Boilerplate about the company
5. Contact information

Tone: credible, objective, newsworthy — suitable for media outlets.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }

  async generateWebsitePageCopy(pageData: any): Promise<string> {
    const systemPrompt = `You are a professional website copywriter. Craft persuasive and clear website content that communicates the offer, highlights features and benefits, and builds trust. Focus on conversion.`;

    const userPrompt = `Generate website page copy based on the following data:

Website Page Data: ${JSON.stringify(pageData)}

Output:
1. Hero section: headline, subheadline, CTA
2. Features and benefits section
3. Social proof or testimonials
4. Trust-building content (FAQs, credentials, etc.)

Make it engaging, scannable, and persuasive for online visitors.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || "";
  }
}

export const deepSeekService = new DeepSeekService();
