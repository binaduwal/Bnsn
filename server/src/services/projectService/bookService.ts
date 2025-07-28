import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BookService extends DeepSeekService {
  async generateBookDescriptionStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a professional book copywriter and emotional storytelling expert. You specialize in writing captivating book descriptions that hook the reader, communicate the core concept, create emotional resonance, and compel action. Your tone can be adapted based on genre, target audience, and purpose (sales, Amazon, landing pages, etc.). Response must start directly with <html> and end with </html>. All content must be inside <body>.`;

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
      `You are tasked with generating a compelling book description based on the blueprint and project context.`,
      ``,
      `## 🎯 Your Goal`,
      `Write a high-converting book description that emotionally engages the target reader, builds intrigue, and clearly communicates the value of the book.`,
      ``,
      `## ✍️ Output Structure`,
      `Return 1 full description with these sections:`,
      `- Short opening hook (1–2 lines that spark curiosity)`,
      `- Emotional setup (what pain, desire, or question the reader has)`,
      `- What the book offers (a preview of what's inside or how it helps)`,
      `- Call to action (encouraging the reader to buy or read now)`,
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
      <div class="book-description">
        <p><strong>Hook:</strong> [Short curiosity-grabbing opener]</p>
        <p><strong>Emotional Setup:</strong> [What the reader is struggling with or hoping for]</p>
        <p><strong>What the Book Offers:</strong> [Tease the solution, ideas, or story without spoiling]</p>
        <p><strong>Call to Action:</strong> [Encouragement to buy, read, or take action]</p>
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
      temperature: 0.88,
      max_tokens: 1000,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

  async generateBookSalesEmailStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    topic: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a master email copywriter specializing in book launches and author campaigns. You write persuasive, emotionally resonant sales emails that grab attention, tell a story, build desire, and drive action. Your style adapts to the genre and audience of the book. Response must start directly with <html> and end with </html>. All content must be inside <body>.`;

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
      `You are tasked with writing a high-converting book sales email for ${topic} that persuades the target reader to buy.`,
      ``,
      `## 🎯 Your Goal`,
      `Write a book sales email that creates emotional engagement, builds intrigue around the book, and ends with a strong call to action.`,
      ``,
      `## ✉️ Output Structure`,
      `Return one complete email with the following parts:`,
      `- Subject Line`,
      `- Opening Line (grabs attention and creates curiosity)`,
      `- Body (connects emotionally, explains value of the book, builds anticipation)`,
      `- Call to Action (clear ask to buy or read now)`,
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
      <div class="book-sales-email">
        <p><strong>Subject Line:</strong> [Eye-catching email subject]</p>
        <p><strong>Opening Line:</strong> [First line of the email to hook reader]</p>
        <p><strong>Body:</strong> [Emotional story + book value explanation]</p>
        <p><strong>Call to Action:</strong> [Encouragement to buy/read now + link if applicable]</p>
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
      temperature: 0.89,
      max_tokens: 1000,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }
  async generateBookIdeasStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a creative book strategist and high-concept idea generator. You understand genres, tropes, audience psychology, and storytelling structure. You come up with original, compelling book ideas that are marketable and emotionally resonant. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
      `You are tasked with generating powerful, unique book ideas based on the user's creative blueprint.`,
      ``,
      `## 📘 Your Goal`,
      `Generate book ideas that stand out in the market, resonate emotionally with the target reader, and align with the provided blueprint.`,
      ``,
      `## 📚 Output Structure`,
      `Return 3 book ideas, each with the following details:`,
      `- Title`,
      `- Genre`,
      `- Hook/Concept (1–2 sentence idea)`,
      `- Target Reader`,
      `- Why It Will Sell (based on current trends or unmet needs)`,
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
            <div class="book-idea">
      <h2>[Book Title]</h2>
      <p><strong>Genre:</strong> [Genre]</p>
      <p><strong>Hook:</strong> [High-concept summary]</p>
      <p><strong>Target Reader:</strong> [Who it’s for]</p>
      <p><strong>Why It Will Sell:</strong> [Market justification]</p>
    </div>
    <div class="book-idea">...</div>
    <div class="book-idea">...</div>
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
      max_tokens: 1100,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

  async generateBookBuilderOutlineStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a professional book planner and outline architect. You specialize in structuring non-fiction books that are clear, compelling, and easy to follow. You create outlines that are logically organized, emotionally resonant, and aligned with the book’s purpose and audience. Always return valid HTML starting with <html> and ending with </html>. All content must be inside <body>.`;

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
      `You are tasked with building a clear, chapter-based outline for a powerful non-fiction book.`,
      ``,
      `## 🎯 Your Goal`,
      `Generate a book outline with logical structure, emotional hooks, and clear learning progression. Each part and chapter should align with the reader’s journey and the book’s promise.`,
      ``,
      `## 🧱 Output Structure`,
      `Return a full outline including:`,
      `- Book Title (based on blueprint if not already given)`,
      `- Part/Section Titles (optional if the book is not split into parts)`,
      `- Chapter Titles`,
      `- Chapter Descriptions (3-4 lines explaining what each chapter covers)`,
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
      <div class="book-outline">
        <h2>[Book Title]</h2>
        <div class="book-part">
          <h3>[Part 1 Title]</h3>
          <div class="chapter">
            <h4>[Chapter 1 Title]</h4>
            <p>[Brief description of Chapter 1]</p>
          </div>
          <div class="chapter">
            <h4>[Chapter 2 Title]</h4>
            <p>[Brief description of Chapter 2]</p>
          </div>
        </div>
        <div class="book-part">...</div>
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
      temperature: 0.91,
      max_tokens: 1300,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }


  //book builder category
  async generateBookBuilderStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a master book outliner who specializes in structuring content-rich, transformation-focused books. You break down abstract ideas into a concrete, easy-to-follow outline with clear parts, chapters, and subpoints. Your goal is to help the author organize their ideas into a professional-level book structure. The response must start directly from <html> and end with </html>, no intros, and all content must be inside <body>.`;

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
      `You are tasked with outlining a complete book based on the provided blueprint and project inputs.`,
      ``,
      `## 📘 Your Goal`,
      `Generate a professional, well-structured book outline that clearly defines each part, its chapters, and what will be covered.`,
      ``,
      `## 🧱 Output Structure`,
      `Return the following:`,
      `- Book Title`,
      `- Genre`,
      `- Book Premise (short paragraph)`,
      `- Target Audience`,
      `- Full Outline (3–5 Parts, each with 2–4 Chapters, each chapter with 1–2 bullet points of what it covers)`,
      ``,
      `## 🧩 Provided Inputs`,
      `${formattedCategoryInputs}`,
      ``,
      `## 💡 Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `## ✅ Output Format`,
      'if you use CSS, only use Inline CSS',
      `<html>
      <body>
        <h1>[Book Title]</h1>
        <p><strong>Genre:</strong> [Genre]</p>
        <p><strong>Premise:</strong> [Brief overview of the book's purpose and theme]</p>
        <p><strong>Target Audience:</strong> [Who will benefit from this book]</p>

        <h2>Book Outline</h2>
        <ol>
          <li>
            <h3>Part 1: [Part Title]</h3>
            <ul>
              <li>
                <strong>Chapter 1: [Chapter Title]</strong>
                <ul>
                  <li>[Main idea or lesson covered]</li>
                  <li>[Supporting idea or story]</li>
                </ul>
              </li>
              <li>
                <strong>Chapter 2: [Chapter Title]</strong>
                <ul>
                  <li>[Main idea or lesson covered]</li>
                  <li>[Supporting idea or story]</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <h3>Part 2: [Part Title]</h3>
            <ul>
              <li>
                <strong>Chapter 1: [Chapter Title]</strong>
                <ul>
                  <li>[Main idea or lesson covered]</li>
                  <li>[Supporting idea or story]</li>
                </ul>
              </li>
              <!-- Continue as needed -->
            </ul>
          </li>
        </ol>
      </body>
    </html>`,
      ``,
      `Only return pure HTML. No markdown or commentary.`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.91,
      max_tokens: 1600,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }



}

export const bookService = new BookService()