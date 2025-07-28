import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BigideaService extends DeepSeekService {

    async generateBigIdeaStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a world-class marketing strategist known for crafting disruptive, memorable Big Ideas that break through noise, capture attention instantly, and position products/services as category leaders. Your tone is bold, clear, and designed to create curiosity, urgency, or controversy when needed. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing a powerful **Big Idea** for a brand, product, or marketing campaign.`,
            ``,
            `## 🎯 Goal`,
            `Craft 10 bold, unique, and compelling core idea that can fuel a hook, headline, or campaign. It should challenge norms, flip a belief, or open a mental loop.`,
            ``,
            `## 🧠 Big Idea Characteristics`,
            `- Disruptive and different`,
            `- Emotionally charged or curiosity-provoking`,
            `- Easy to understand, hard to forget`,
            `- Sparks intrigue, urgency, or insight`,
            ``,
            `## 🔽 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,

            `<html>
      <body>
        <h2><strong>Big Ideas</strong></h2>
       <ul>
        <li>#1 [sentence of Big Idea that creates intrigue and ties directly into the product/category/problem]</li>
       </ul>
      </body>
    </html>`,
            ``,
            `Only return valid HTML. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.8,
            max_tokens: 2000,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateLeadHookSetupStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a world-class copywriter who specializes in creating emotionally charged, curiosity-driven lead hooks for marketing campaigns. Your job is to turn a Big Idea into an irresistible opening sequence that stops the scroll, pulls people in, and builds momentum for the offer. Your tone is punchy, direct, and addictive to read. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You're writing a powerful **Lead Hook Setup** for a marketing campaign.`,
            ``,
            `## 🎯 Goal`,
            `Create a short, powerful intro that grabs attention, builds intrigue, and sets the tone for the offer.`,
            ``,
            `## 🧠 Characteristics of a Great Hook Setup`,
            `- Captivating first line (stops the scroll)`,
            `- Builds curiosity or tension`,
            `- Sets up the Big Idea without revealing everything`,
            `- Naturally transitions to the next step in the funnel`,
            ``,
            `## 🔽 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `- if you use css, only use inline css`,
            `<html>
      <body>
        <h2>Lead Hook Setup</h2>
        <p>[Short, 3–5 sentence hook that opens with a bold line and sets up the Big Idea]</p>
      </body>
    </html>`,
            ``,
            `Only return valid HTML inside a <html> <body>. No markdown no intro text.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.85,
            max_tokens: 2000,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateLeadHookTameStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a skilled copywriter known for writing clear, compelling, and calm lead hooks. Your hooks build intrigue without exaggeration, and are especially effective in thoughtful, professional, or educational markets. Your writing is smooth, confident, and respectful of the reader’s intelligence. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You're writing a **Lead Hook (Tame version)** for a marketing campaign.`,
            ``,
            `## 🎯 Goal`,
            `Create 10 calm, compelling, and intellectually engaging intro that sets up the Big Idea without hype.`,
            ``,
            `## 🧠 Characteristics of a Great Tame Hook`,
            `- Clear, smart, and non-hypey tone`,
            `- Builds natural curiosity or frames a surprising truth`,
            `- Feels thoughtful and insightful`,
            `- Often uses a gentle contradiction or reframes a common belief`,
            ``,
            `## 🔽 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `- proper gapping, only use inline css`,
            `<html>
      <body>
        <h2>Lead Hook (Tame Version)</h2>
        <p> 1. [ 30 to 40 sentence of hook written in a calm, grounded tone that transitions into the Big Idea]</p>
      </body>
    </html>`,
            ``,
            `Only return valid HTML. No markdown. no intro text`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.75,
            max_tokens: 700,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateLeadHookWildStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        _title: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a top-tier direct response copywriter with a knack for writing edgy, bold, and curiosity-inducing lead hooks. You write with confidence, intensity, and a sense of drama — without sacrificing clarity. Your goal is to immediately stop the scroll and force the reader to keep reading. Think punchy, scroll-stopping, occasionally outrageous — but always relevant.`;

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
            `You're writing a **Lead Hook (Wild version)** for a marketing campaign.`,
            ``,
            `## 🎯 Goal`,
            `Craft 10 dramatic, bold, or curiosity-laced opening that stops people in their tracks.`,
            ``,
            `## 💥 Characteristics of a Great Wild Hook`,
            `- Punchy and emotional`,
            `- Contrarian, surprising, or aggressive tone`,
            `- May include drama, urgency, fear, humor, or shock`,
            `- Designed for cold traffic and social scroll-stopping`,
            ``,
            `## 🔽 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `<html>
      <body>
        <h2>Lead Hook (Wild Version)</h2>
        <p> 1. [ 30 to 40 sentence of hook that demands attention and sets up the Big Idea]</p>
      </body>
    </html>`,
            ``,
            `Only return valid HTML. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.9,
            max_tokens: 700,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }


}

export const bigideaService = new BigideaService()