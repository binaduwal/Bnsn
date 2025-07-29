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
    categories: ICategory[],
    onProgress?: (chunk: string) => void
  ): Promise<any> {
    // Optimized prompt structure to reduce size and improve DeepSeek response reliability
    const categoryList = categories.map((cat) => ({
      title: cat.title,
      description: cat.description,
      fields: cat.fields.map((f) => ({
        fieldName: f.fieldName,
        fieldType: f.fieldType,
      })),
    }));


    // Optimize category data for prompt
    const simplifiedCategories = categories.map((cat) => ({
      title: cat.title,
      fields: cat.fields.map((f) => f.fieldName),
    }));

    const systemPrompt = `You are a business strategist. Return a JSON array of category objects. Each object must have:
- title: string (exact match from provided list)
- description: string (brief, relevant)
- fields: array of objects with fieldName and value (array of strings)

Categories: ${JSON.stringify(simplifiedCategories)}

CRITICAL: Return ONLY JSON array starting with [ and ending with ]. No markdown or explanations.`;

    const userPrompt = `Create a comprehensive business blueprint for:
Business: ${feedBnsn}
Offer: ${offerType}

IMPORTANT: Fill each field with detailed, actionable content. Provide multiple values for each field where appropriate. Be specific and comprehensive. Include:
- Specific examples and details
- Multiple options/alternatives
- Practical, actionable content
- Industry-specific terminology
- Real-world applications

Return pure JSON only.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 5000,
      temperature: 0.7,
      stream: true,
    };

    // Use streaming if onProgress callback is provided
    if (onProgress) {
      const response = await this.makeStreamingRequest(request, onProgress);
      let content = response;

      // Clean the response to extract JSON
      content = this.cleanJsonResponse(content);

      try {
        return JSON.parse(content);
      } catch (error) {
        console.error("Failed to parse AI response:", error);
        console.error("Raw AI response:", response);
        return [];
      }
    } else {
      // Fallback to non-streaming request
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
    _title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a CRO expert. Write high-converting Thank You pages in pure HTML with inline styles only. Build gratitude, trust, and inspire next actions. Output must be HTML only <html><body>...</body></html> - no explanations or markdown or Intro text. IMPORTANT: Use current information and trends from 2024-2025. Do not reference outdated data or events from before 2024.`;

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
      `Write a complete HTML Thank You Page.`,
      ``,
      `## Guidelines`,
      `- Start with <html> and end with </html>, content must be inside <body>`,
      `- Use ONLY inline styles`,
      `- No <style> tags, CSS classes, or external stylesheets`,
      `- No markdown, comments, or intro text`,
      `- Conversion-focused and mobile-responsive`,
      `- Use <h1>, <h2>, <p>, <ul>, <a>, and CTA buttons`,
      `- No <img> tags`,
      `- Include follow-up CTA like "Refer a Friend", "Shop Again", or "Share Now"`,
      `- Optionally include discount code, support link, or bonus`,
      `- Inject trust and personalization from inputs`,
      ` no explanations or markdown or Intro text`,
      ``,
      `## Input Data`,
      `Context: ${formattedCategoryInputs}`,
      `Brand Voice: ${formattedBlueprint}`,
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
    _title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are an ad copywriter. Write high-converting ad content for Facebook, Instagram, YouTube, TikTok in pure HTML with inline styles only. Response must begin with <html> and end with </html>. DO NOT include any metadata, special formatting, or instructions like [FREEZE FRAME], [PAUSE], or similar. Output ONLY clean HTML content. IMPORTANT: Use current information and trends from 2024-2025. Do not reference outdated data or events from before 2024.`;

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
      `Generate high-converting ad copy in HTML using ONLY inline styles.`,
      ``,
      `## CRITICAL OUTPUT RULES`,
      `- Begin with <html> and end with </html>`,
      `- Use only <div>, <p>, <h1>–<h3>, <strong>, <em>, <ul>, <li>, <a>, and <button> tags`,
      `- Use inline styles only—no CSS classes, <style> tags, or external links`,
      `- Do not include images`,
      `- DO NOT include any metadata, special formatting, or instructions like [FREEZE FRAME], [PAUSE], [CUT TO], or similar`,
      `- DO NOT include any video script directions or production notes`,
      `- Output ONLY clean HTML content that can be directly used`,
      `- Do not output anything other than the HTML document`,
      ``,
      `## Content to Include`,
      `Create 4 separate sections:`,
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
      `   - Wrap up all platforms with urgency-driven CTA paragraph and link`,
      ``,
      `## Style & Tone`,
      `- Friendly, emotional, benefit-driven`,
      `- Use storytelling and emotional resonance`,
      `- Highlight problem, transformation, urgency`,
      `- Make it clear, persuasive, and conversion-focused`,
      `- Write as finished ad copy, not as video script directions`,
      `- Reference current trends, technologies, and market conditions from 2024-2025`,
      ``,
      `## Input Data`,
      `Category Inputs: ${formattedCategoryInputs || ""}`,
      `Blueprint: ${formattedBlueprint}`,
      ``,
      `IMPORTANT: Generate ONLY clean HTML ad copy without any metadata or special formatting. Begin with <html> and end with </html>.`,
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

    const result = await this.makeStreamingRequest(request, onProgress);

    // Clean any metadata that might have slipped through
    if (result) {
      return result
        .replace(/\[FREEZE FRAME\]/gi, '')
        .replace(/\[PAUSE\]/gi, '')
        .replace(/\[CUT TO\]/gi, '')
        .replace(/\[FADE IN\]/gi, '')
        .replace(/\[FADE OUT\]/gi, '')
        .replace(/\[ZOOM IN\]/gi, '')
        .replace(/\[ZOOM OUT\]/gi, '')
        .replace(/\[CLOSE UP\]/gi, '')
        .replace(/\[WIDE SHOT\]/gi, '')
        .replace(/\[SCENE\]/gi, '')
        .replace(/\[ACTION\]/gi, '')
        .replace(/\[DIALOGUE\]/gi, '')
        .replace(/\[NARRATION\]/gi, '')
        .replace(/\[MUSIC\]/gi, '')
        .replace(/\[SFX\]/gi, '')
        .replace(/\[GRAPHIC\]/gi, '')
        .replace(/\[TEXT\]/gi, '')
        .replace(/\[SUBTITLE\]/gi, '')
        .replace(/\[CAPTION\]/gi, '')
        .replace(/\[TITLE\]/gi, '')
        .replace(/\[END\]/gi, '')
        .replace(/\[FIN\]/gi, '')
        .replace(/\[THE END\]/gi, '')
        .trim();
    }

    return result;
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
