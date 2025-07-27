
import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class AdvertorialService extends DeepSeekService {

    async generateAdvertorialsStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        topic: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are an expert copywriter who specializes in creating high-converting advertorials. You understand audience psychology, storytelling, and persuasive content. Your goal is to craft advertorials that build trust, educate, and lead readers to take action. Response should start directly from <html> and end with </html>, no intro texts, and all content must be inside <body>.`;

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
            `You are tasked with writing persuasive and engaging advertorials for this topic: ${topic}, that promote a product or service while providing value and context.`,
            ``,
            `## 🎯 Your Goal`,
            `Craft 2 compelling advertorials for this topic: ${topic}, that feel like helpful articles but subtly promote the offer. Each advertorial should use a storytelling format that builds curiosity and trust.`,
            ``,
            `## 🧱 Structure for Each Advertorial`,
            `- Title (clickable style)`,
            `- Engaging Introduction (relatable hook)`,
            `- Problem Setup`,
            `- Solution Introduction (introduce the product/service)`,
            `- Key Benefits (in storytelling tone)`,
            `- Social Proof (testimonial or data if applicable)`,
            `- Call-To-Action (subtle but clear)`,
            ``,
            `## 🔍 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            'if you use CSS only use Inline CSS',
            `<html>
        <body>
        <div class="advertorial">
            <h2>[Title]</h2>
            <p>[Introduction]</p>
            <p><strong>Problem:</strong> [Relatable problem description]</p>
            <p><strong>Solution:</strong> [Introduce product or service]</p>
            <ul>
                <li>[Benefit 1]</li>
                <li>[Benefit 2]</li>
                <li>[Benefit 3]</li>
            </ul>
            <p><em>“[Customer testimonial or story]”</em></p>
            <p><strong>Call to Action:</strong> [CTA copy]</p>
        </div>
        <div class="advertorial">...</div>
        </body>
        </html>`,
            ``,
            `Only return HTML. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.92,
            max_tokens: 1400,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateLongFormAdvertorialStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        topic: string,
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a master copywriter specializing in long-form advertorials that blend storytelling and persuasion. Your writing is emotionally compelling, rich in detail, and subtly drives action. Always return a full HTML document starting with <html> and ending with </html>. All content must be wrapped inside <body>.`;

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
            `You are tasked with writing a **long-form advertorial** for this topic: ${topic}, that reads like a high-quality editorial article but is designed to sell.`,
            ``,
            `## 🧠 Strategy`,
            `Use storytelling, emotional triggers, empathy, benefits, objections, proof, and strong calls to action. Build the story gradually and include all elements of persuasive copywriting.`,
            ``,
            `## 🧱 Structure`,
            `1. Powerful Headline`,
            `2. Subheadline that builds curiosity`,
            `3. Emotional Story-Based Introduction`,
            `4. The Problem (empathy + pain points)`,
            `5. The Turning Point`,
            `6. Introducing the Solution`,
            `7. Deep Benefits (expanded in storytelling format)`,
            `8. Objection Handling`,
            `9. Social Proof (testimonial, user story, data)`,
            `10. Strong CTA (with urgency or logic-based motivator)`,
            `11. FAQ section (address final objections)`,
            ``,
            `## Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## 📄 Output Format`,
            'if you use CSS, only use Inline CSS',
            `<html>
        <body>
        <article>
            <h1>[Headline]</h1>
            <h2>[Subheadline]</h2>
            <p>[Intro Story]</p>
            <h3>The Problem</h3>
            <p>[Describe pain points]</p>
            <h3>The Turning Point</h3>
            <p>[What changed? What was discovered?]</p>
            <h3>Meet the Solution</h3>
            <p>[Introduce product/service]</p>
            <h3>Why It Works</h3>
            <ul>
                <li>[Benefit 1]</li>
                <li>[Benefit 2]</li>
                <li>[Benefit 3]</li>
                <li>[Benefit 4]</li>
            </ul>
            <h3>What Others Are Saying</h3>
            <blockquote>“[Testimonial]”</blockquote>
            <h3>Take the Next Step</h3>
            <p>[CTA Section with urgency]</p>
            <h3>Frequently Asked Questions</h3>
            <p><strong>Q:</strong> [Question 1]<br/><strong>A:</strong> [Answer 1]</p>
            <p><strong>Q:</strong> [Question 2]<br/><strong>A:</strong> [Answer 2]</p>
        </article>
        </body>
        </html>`,
            ``,
            `Only return HTML. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.92,
            max_tokens: 2000,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }


}

export const advertorialService = new AdvertorialService()

