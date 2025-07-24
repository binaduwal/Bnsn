import axios from "axios";
import { DeepSeekRequest, DeepSeekResponse } from "../types";
import { createError } from "../middleware/errorHandler";
import { ICategory } from "../models/Category";
import "dotenv/config";
import { BlueprintValue, ProjectCategoryValue } from "../types/project";

export class DeepSeekService {
  private apiKey: string;
  private baseURL: string;
  protected defaultModel: string;

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
          `DeepSeek API error: ${error.response.data?.error?.message || error.response.statusText
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

  protected async makeStreamingRequest(
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
        `Failed to generate email: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const deepSeekService = new DeepSeekService();
