
import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class OptInPageService extends DeepSeekService {

    async generateOptInPageV1Stream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a top-tier direct response copywriter with deep expertise in writing high-converting opt-in pages. You know how to craft short, compelling landing pages that instantly communicate value, build trust, and get the lead. Your copywriting is simple, persuasive, and conversion-focused.`;

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
            `You're writing **Opt-In Page Copy (Version 1)** for a campaign.`,
            ``,
            `## 🎯 Goal`,
            `Write a short opt-in page that encourages the visitor to take quick action — download a freebie, sign up, or claim a benefit. The copy should feel low-risk and high-value.`,
            ``,
            `## ✍️ Structure`,
            `1. Headline — Grab attention quickly with a benefit-focused promise`,
            `2. Subheadline — Expand the promise and clarify what they'll get`,
            `3. CTA Copy — Simple invitation to enter email and get the freebie`,
            `4. (Optional) Trust Element — Quick credibility booster like a stat, testimonial, or reassurance`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `<html>
          <body>
            <h1>[Headline]</h1>
            <p><strong>[Subheadline]</strong></p>
            <form>
              <input type="email" placeholder="Enter your email" />
              <button>Get [Freebie/Resource/Access] Now</button>
            </form>
            <p class="trust">[Optional trust element or reassurance]</p>
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
            temperature: 0.85,
            max_tokens: 700,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }


    async generateOptInPageV2Stream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-level conversion copywriter with expertise in crafting emotionally compelling, story-driven opt-in pages. You understand user psychology and write persuasive copy that builds trust, triggers curiosity, and motivates action.`;

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
            `You're writing **Opt-In Page Copy (Version 2)** — a slightly longer landing page that blends story and emotion with clear conversion tactics.`,
            ``,
            `## 🎯 Goal`,
            `Create a high-converting opt-in page that pulls the reader in with a relatable hook, builds credibility, and offers a no-brainer lead magnet or promise.`,
            ``,
            `## 📘 Structure`,
            `1. Emotional Headline — Address pain, desire, or curiosity`,
            `2. Relatable Story or Pain Point — Pull them in with a few lines that feel personal`,
            `3. Introduce the Solution/Freebie — What they’ll get & how it helps`,
            `4. CTA Section — Invite them to opt in`,
            `5. Trust Booster — Quick testimonial, success stat, or credibility proof`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 💡 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `<html>
      <body>
        <h1>[Headline]</h1>
        <p>[Story or Pain Point Introduction]</p>
        <p>[Freebie/Solution Description]</p>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button>Yes, I Want This</button>
        </form>
        <p class="trust">[Trust booster]</p>
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
            temperature: 0.88,
            max_tokens: 900,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

}

export const optInPageService = new OptInPageService()