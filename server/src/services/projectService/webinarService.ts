import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class WebinarService extends DeepSeekService {

    async generateWebinarContentStream(
      topic: string,
      blueprintValue: BlueprintValue[],
      projectCategoryValue: ProjectCategoryValue[],
      onProgress?: (chunk: string) => void
    ): Promise<string> {
      const systemPrompt = `You are a high-converting webinar strategist and persuasive messaging expert. You specialize in creating compelling webinar segments based on classic conversion frameworks such as testimonials, objection handling, authority building, big idea hooks, and value delivery. You understand audience psychology and design webinar scripts that engage, build trust, and convert. Response must start directly with <html> and end with </html>. All content must be inside <body>.`;
    
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
        `You are tasked with generating content for the webinar segment titled: **"${topic}"**.`,
        ``,
        `## 🎯 Your Goal`,
        `Generate content that aligns with the segment's psychological goal:`,
        `- If it's "The Three Things": introduce the 3 beliefs or pillars the audience must adopt to succeed.`,
        `- If it's "Webinar Testimonials": share story-driven testimonials that demonstrate real transformation.`,
        `- If it's "Overcoming Objections": preemptively address hesitations and fears, with empathy and logic.`,
        `- If it's "Big Idea" or "Authority Builder": clearly establish credibility, expertise, and innovation.`,
        ``,
        `## ✨ Output Structure`,
        `Return formatted HTML content with:`,
        `- Section Title`,
        `- Segment Purpose`,
        `- Scripted Content (story, bullet points, persuasive lines, quotes, etc.)`,
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
          <div class="webinar-section">
            <h2>${topic}</h2>
            <p><strong>Purpose:</strong> [Explain why this section exists in the sales flow]</p>
            <div class="content-block">
              <p>[Persuasive script or bullet points that align with the section’s goal]</p>
            </div>
          </div>
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
        max_tokens: 1200,
      };
    
      return await this.makeStreamingRequest(request, onProgress);
    }
}

export const webinarService = new WebinarService()
