import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class BookService extends DeepSeekService {
  async generateBookDescriptionStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title: string,
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
    _title: string,
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
    _title: string,
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
    title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemBase = `You are a professional book strategist who helps authors develop, structure, and position their books. Your responses must be in valid HTML only, wrapped in <html><body>...</body></html>. Do not include markdown, commentary, or external CSS. If styling is used, apply inline CSS only.`;

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

    let systemPrompt = systemBase;
    let userPrompt = '';
    const sharedInputs = `## 🧩 Provided Inputs\n${formattedCategoryInputs}\n\n## 💡 Blueprint\n${formattedBlueprint}\n`;

    switch (title) {
      case "1: Book Length":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Estimate the ideal book length based on the topic, depth, and audience. Provide a word count range, page count, and recommended part/chapter count.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>Recommended Book Length</h1>
            <p><strong>Word Count Range:</strong> [e.g. 30,000–40,000 words]</p>
            <p><strong>Estimated Page Count:</strong> [e.g. 150–200 pages]</p>
            <p><strong>Suggested Structure:</strong></p>
            <ul>
              <li>[Number of Parts: e.g. 3–5]</li>
              <li>[Number of Chapters: e.g. 10–15]</li>
            </ul>
          </body>
        </html>`
        ].join('\n');
        break;

      case "2: About Your Book":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Write a compelling "About This Book" section. Explain the purpose, audience, benefits, and tone.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>About This Book</h1>
            <p><strong>What It’s About:</strong> [Brief summary]</p>
            <p><strong>Who It’s For:</strong> [Target reader]</p>
            <p><strong>Why It Matters Now:</strong> [Relevance]</p>
            <p><strong>Reader Transformation:</strong> [End result]</p>
            <p><strong>Writing Style & Tone:</strong> [Tone: motivational, practical, etc.]</p>
          </body>
        </html>`
        ].join('\n');
        break;

      case "3: Create Your Outline":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Build a detailed book outline with parts and chapters. Each chapter should have a short summary.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>[Book Title]</h1>
            <h2>Book Outline</h2>
            <ol>
              <li>
                <h3>Part 1: [Part Title]</h3>
                <ul>
                  <li>
                    <strong>Chapter 1: [Chapter Title]</strong>
                    <p>[1–2 sentence summary]</p>
                  </li>
                  <li>
                    <strong>Chapter 2: [Chapter Title]</strong>
                    <p>[1–2 sentence summary]</p>
                  </li>
                </ul>
              </li>
              <!-- Repeat for Part 2, 3, etc. -->
            </ol>
          </body>
        </html>`
        ].join('\n');
        break;

      case "4: Title Your Book":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Generate 3–5 captivating book title options and optional subtitles based on the book’s topic and tone.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>Book Title Ideas</h1>
            <ul>
              <li><strong>Title 1:</strong> [Main Title] <br /><em>Subtitle:</em> [Optional Subtitle]</li>
              <li><strong>Title 2:</strong> [Main Title] <br /><em>Subtitle:</em> [Optional Subtitle]</li>
              <li><strong>Title 3:</strong> [Main Title] <br /><em>Subtitle:</em> [Optional Subtitle]</li>
            </ul>
          </body>
        </html>`
        ].join('\n');
        break;

      case "5: Monetize Your Book":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Suggest practical ways to monetize the book beyond direct sales: upsells, coaching, licensing, etc.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>Monetization Strategy</h1>
            <ul>
              <li><strong>Offer 1:</strong> [e.g. Online course upsell]</li>
              <li><strong>Offer 2:</strong> [e.g. Group coaching]</li>
              <li><strong>Offer 3:</strong> [e.g. Speaking engagements]</li>
              <li><strong>Offer 4:</strong> [e.g. Affiliate partnerships]</li>
            </ul>
          </body>
        </html>`
        ].join('\n');
        break;

      case "6: Personalize Your Book":
        userPrompt = [
          `## 🎯 Your Goal`,
          `Provide creative ideas to personalize the book — storytelling style, voice, anecdotes, visuals, writing quirks, etc.`,
          ``,
          sharedInputs,
          ``,
          `## ✅ Output Format`,
          `<html>
          <body>
            <h1>Personalization Tips</h1>
            <ul>
              <li><strong>Voice & Tone:</strong> [e.g. Conversational, bold, witty]</li>
              <li><strong>Storytelling:</strong> [e.g. Real stories, fictional examples]</li>
              <li><strong>Visual Elements:</strong> [e.g. Diagrams, icons, illustrations]</li>
              <li><strong>Interactive:</strong> [e.g. Worksheets, reflection sections]</li>
            </ul>
          </body>
        </html>`
        ].join('\n');
        break;

      default:
        userPrompt = [
          `## 🎯 Your Goal`,
          `No specific title match found. Use the provided blueprint to generate a useful output.`,
          ``,
          sharedInputs,
          `<html><body><p>No template matched for the title: ${title}</p></body></html>`
        ].join('\n');
    }

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.9,
      max_tokens: 1600,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }


  async generateBookWritePartStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {

    const systemPrompt = `You are a professional book writer and storytelling expert. You understand structure, tone, pacing, and how to write engaging content that aligns with a book's core idea and audience. Your job is to write the content for a book part based on the provided title, blueprint, and project category. Response should be direct HTML starting from <html> and ending at </html>. All content should be inside <body>.`;

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
      `You are tasked with writing a full section (or chapter) of a book.`,
      ``,
      `## ✍️ Your Task`,
      `Write the full content of the book section titled: **${title}**`,
      `Use a tone, structure, and vocabulary that matches the intended reader.`,
      `Incorporate storytelling, value, or education as needed based on the genre.`,
      ``,
      `## 📘 Provided Title`,
      `${title}`,
      ``,
      `## 💡 Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `## 🧭 Details provided by the user: `,
      `${formattedCategoryInputs}`,
      ``,
      `## ✅ Output Format`,
      'only use Inline CSS',
      `<html>
      <body>
        <div>
          <h2>${title}</h2>
          <p>[Your fully written book part goes here]</p>
        </div>
      </body>
    </html>`,
      ``,
      `Only return valid HTML. Do not use markdown.`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.9,
      max_tokens: 1600,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }

  async generateFinalChapterOfferStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a world-class direct response copywriter and book strategist. You specialize in crafting powerful final chapter offers that feel authentic and compelling. Your job is to write the closing section of the book, including a soft pitch, invitation, or call to action aligned with the book's purpose and audience. Always write in clean HTML format starting with <html> and ending with </html>.`;

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
      `## ✍️ Your Task`,
      `Write the **final chapter offer** for this book.`,
      ``,
      `This is the last thing the reader sees, so it should either:`,
      `- Invite the reader to take the next step (like coaching, joining a group, buying a course, etc.)`,
      `- Encourage action, implementation, or sharing`,
      `- Reinforce the reader's belief and journey`,
      ``,
      `It should feel natural, not pushy. Aim to inspire and nudge action.`,
      ``,
      `## 💡 Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `## 🧭 Project Categories`,
      `${formattedCategoryInputs}`,
      ``,
      `## ✅ Output Format`,
      'only use inline CSS',
      `<html>
      <body>
        <div">
          <h2>Final Chapter: Your Next Step</h2>
          <p>[Your inspiring closeout message and CTA goes here]</p>
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
      temperature: 0.9,
      max_tokens: 1200,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }



}

export const bookService = new BookService()