

import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class VslPageService extends DeepSeekService {
  async generateVSLScriptStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title:string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level direct response copywriter trained in Jon Benson's VSL structure. Your job is to write long-form Video Sales Letter (VSL) scripts that convert cold traffic into buyers. The tone is persuasive, emotional, and structured for maximum attention, trust, and action. Response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>.`;

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
      `- Then follow Jon Benson's 11-stage VSL framework (listed below).`,
      `- Use direct, natural, conversational copy — no corporate jargon or fluff.`,
      ``,
      `## ✅ Output Format`,
      `- Response must start with <html> and end with </html>`,
      `- All content must be inside <body> tags`,
      `- Use <h1>, <h2>, <p>, <strong>, <em>, <ul>, and <a> appropriately`,
      `- Use only inline CSS`,
      `- NO <img>, <video>, or script tags`,
      `- NO markdown, explanations, or comments`,
      `- Do NOT include any intro text or explanations - start directly with <html>`,
      ``,
      `## 🧱 Structure (Jon Benson's VSL Framework)`,
      `1. Pattern Interrupt / Shocking Opening`,
      `2. Agitate The Problem`,
      `3. Personal Story & Relatable Transformation (Hero's Journey Style)`,
      `4. Introduce The Unique Shift / Method`,
      `5. Present The Core Solution`,
      `6. Stack The Benefits / Social Proof`,
      `7. Overcome Objections & Inject Urgency`,
      `8. Stack The Value`,
      `9. Offer Guarantee`,
      `10. Create Scarcity / Limited-Time Bonus`,
      `11. Final Call-To-Action`,
      ``,
      `## 📋 Requirements:`,
      `- Generate exactly 1 complete VSL script`,
      `- Use Valid HTML Elements <html> <body>`,
      `- Only use inline css`,
      `- Use proper spacing and styling to make UI look better`,
      `- Only return valid HTML. No markdown, no intro text, no explanations`,
      ``,
      `Below are important context values submitted by the user. Use them to generate the VSL.`,
      ``,
      `## 📥 User submitted Input Data`,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Brand Voice & Messaging`,
      `${formattedBlueprint}`,
      ``,
      `Your response must be clean HTML blocks only. No markdown. No extra explanation.`,
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

  async generateVSLScriptStreamDynamic(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    title: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a senior-level direct response copywriter trained in Jon Benson's VSL structure. Your job is to write long-form Video Sales Letter (VSL) scripts that convert cold traffic into buyers. The tone is persuasive, emotional, and structured for maximum attention, trust, and action. Response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>.`;

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
      `Write a complete, emotionally-driven, long-form HTML Video Sales Letter (VSL) script for the following title: **${title}**.`,
      ``,
      `## 🎯 Objective`,
      `This VSL should support a 25–45 minute spoken video designed to convert cold traffic.`,
      ``,
      `## 💡 Style Requirements`,
      `- Start with a raw, relatable backstory (that is in the values submitted by User) that builds empathy and authority.`,
      `- Then follow Jon Benson's 11-stage VSL framework (listed below).`,
      `- Use direct, natural, conversational copy — no corporate jargon or fluff.`,
      ``,
      `## ✅ Output Format`,
      `- Response must start with <html> and end with </html>`,
      `- All content must be inside <body> tags`,
      `- Use <h1>, <h2>, <p>, <strong>, <em>, <ul>, and <a> appropriately`,
      `- Use only inline CSS`,
      `- NO <img>, <video>, or script tags`,
      `- NO markdown, explanations, or comments`,
      `- Do NOT include any intro text or explanations - start directly with <html>`,
      ``,
      `## 🧱 Structure (Jon Benson's VSL Framework)`,
      `1. Pattern Interrupt / Shocking Opening`,
      `2. Agitate The Problem`,
      `3. Personal Story & Relatable Transformation (Hero's Journey Style)`,
      `4. Introduce The Unique Shift / Method`,
      `5. Present The Core Solution`,
      `6. Stack The Benefits / Social Proof`,
      `7. Overcome Objections & Inject Urgency`,
      `8. Stack The Value`,
      `9. Offer Guarantee`,
      `10. Create Scarcity / Limited-Time Bonus`,
      `11. Final Call-To-Action`,
      ``,
      `## 📋 Requirements:`,
      `- Generate exactly 1 complete VSL script`,
      `- Use Valid HTML Elements <html> <body>`,
      `- Only use inline css`,
      `- Use proper spacing and styling to make UI look better`,
      `- Only return valid HTML. No markdown, no intro text, no explanations`,
      ``,
      `## 📥 User submitted Input Data`,
      `${formattedCategoryInputs}`,
      ``,
      `## 👤 Brand Voice & Messaging`,
      `${formattedBlueprint}`,
      ``,
      `Your response must be clean HTML blocks only. No markdown. No extra explanation.`,
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



  // mini vsl 
  async generateMiniVslLeadStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title:string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a world-class direct response copywriter who specializes in writing captivating Mini VSL Leads (Video Sales Letters) that hook the viewer, build tension, and lead into the pitch. You understand pacing, emotional triggers, and how to move the prospect toward curiosity and commitment without revealing everything up front. Always return a complete HTML document starting with <html> and ending with </html>. All content must be inside <body>.`;

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
      `You are writing the first 1–2 minutes of a mini VSL script (video sales letter).`,
      ``,
      `## 🎯 Objective`,
      `- Grab attention immediately (hook).`,
      `- Stir up a deep problem, agitation, or internal frustration.`,
      `- Tease the promise, but hold back the full reveal.`,
      `- Flow naturally as a spoken script (not overly formal).`,
      `- Keep the copy punchy and emotional.`,
      ``,
      `## 🎬 Script Elements`,
      `1. Hook (question, bold claim, shocking stat, or relatable frustration)`,
      `2. Problem agitation (why this is a painful or urgent issue)`,
      `3. Emotional pull (what’s at stake if not solved)`,
      `4. Bridge (hint at solution, but don't pitch it yet)`,
      ``,
      `## Provided Inputs`,
      `${formattedCategoryInputs}`,
      ``,
      `## 🧠 Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `## ✅ Output Format`,
      'if you use CSS, only use inline CSS',
      `<html>
    <body>
    <div>
      <p>[Hook Line]</p>
      <p>[Problem Agitation]</p>
      <p>[Emotional Stakes]</p>
      <p>[Bridge to Solution]</p>
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
      temperature: 0.95,
      max_tokens: 1000,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }
  async generateVslTslLeadStream(
    blueprintValue: BlueprintValue[],
    projectCategoryValue: ProjectCategoryValue[],
    _title:string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = `You are a world-class direct response copywriter who specializes in creating long-form Video and Text Sales Letter leads. You understand emotional storytelling, pacing, buyer psychology, and how to build intrigue. Your job is to create compelling long leads that hook attention, agitate the pain, emotionally connect, and transition naturally into the sales message. Always return a complete HTML document starting with <html> and ending with </html>. All content must be inside <body>.`;

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
      `You are writing a longer-form lead (1000-2000 words) for a Video or Text Sales Letter.`,
      ``,
      `## 🎯 Objective`,
      `- Hook the prospect immediately.`,
      `- Stir pain, agitation, or conflict.`,
      `- Relate emotionally through story or metaphor.`,
      `- Build desire and tease the transformation.`,
      `- End with a transition into the core pitch.`,
      ``,
      `## 🎬 Script Structure`,
      `1. Headline Hook (bold claim, powerful question, emotional trigger)`,
      `2. Deep Agitation (painful narrative, relatable frustration, etc.)`,
      `3. Stakes & Struggle (what happens if they don’t act)`,
      `4. Empathy & Connection (show you understand their world)`,
      `5. Transition to Solution (setup for the pitch)`,
      ``,
      `## Provided Inputs`,
      `${formattedCategoryInputs}`,
      ``,
      `## 🧠 Blueprint`,
      `${formattedBlueprint}`,
      ``,
      `## ✅ Output Format`,
      'if you use CSS, only use Inline CSS',
      `<html>
    <body>
    <div>
      <p>[Headline Hook]</p>
      <p>[Agitation/Problem Narrative]</p>
      <p>[Emotional Stakes]</p>
      <p>[Empathy & Relatable Story]</p>
      <p>[Bridge to Solution]</p>
    </div>
    </body>
    </html>`,
      ``,
      `Only return HTML. No markdown.no intro text`,
    ].join("\n");

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.95,
      max_tokens: 1200,
    };

    return await this.makeStreamingRequest(request, onProgress);
  }


}

export const vslPageService = new VslPageService()