import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class SalesFunnelService extends DeepSeekService {

    async generatePresellIntroStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level copywriter and marketing strategist. You specialize in creating high-converting presell content that grabs attention, builds curiosity, and pre-frames the reader to desire the solution being offered. Your tone is emotionally resonant, curiosity-driven, and subtly persuasive.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with creating a **presell article topic or headline** for a product or service.`,
            ``,
            `## 🧩 Provided Inputs details by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint Details`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            `🎯 Objective: Create a presell intro **topic** or **headline** that attracts curiosity and highlights the reader’s pain, desire, or disbelief.`,
            ``,
            `✍️ Guidelines:`,
            `- Focus on 1–2 strong, curiosity-based headline ideas.`,
            `- Use styles like: "What No One Tells You About...", "How X Is Quietly Solving Y...", "Why Most People Struggle With Z (And What To Do Instead)"`,
            `- No clickbait, but make it emotionally engaging.`,
            ``,
            `🔁 Output Format:`,
            ``,
            `- Use Valid HTML Elements  <html> <body>`,
            `- <h1>Presell Intro Headline</h1>`,
            `- <p>1–2 lines about why this angle works or what emotion it triggers (optional).</p>`,
            ``,
            `Use only HTML. No markdown.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 1000,
            temperature: 0.75,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generatePresellStepsStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level copywriter and marketing strategist. You specialize in crafting persuasive presell sequences that smoothly move the reader from curiosity to conversion. Your tone is emotionally resonant, curiosity-driven, and structured for high engagement.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with creating a **presell steps sequence** for a product, service, or offer. `,
            ``,
            `## 🧩 Provided Inputs details by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint Details`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            `🎯 Objective: Create a step-by-step persuasive narrative that builds belief, highlights pain/desire, creates curiosity, and opens the loop toward the solution.`,
            ``,
            `🪜 Typical Flow:`,
            `1. Introduce the problem with emotion.`,
            `2. Share a common myth or misconception.`,
            `3. Introduce an unconventional insight.`,
            `4. Seed the idea of a better way (without revealing it fully).`,
            `5. Tease what’s coming (sales page, webinar, product, etc.).`,
            ``,
            `✍️ Guidelines:`,
            `- Write as if guiding someone through a psychological journey.`,
            `- Use long, emotionally charged paragraphs.`,
            `- Avoid revealing the offer too early.`,
            `- response should be little longer`,
            ``,
            `🔁 Output Format:`,
            `- Use Valid HTML Elements  <html> <body>`,
            `<h2>Step 1: [Step Title]</h2>`,
            `<p>Explanation in 2–4 lines. Focus on emotional triggers, clarity, and curiosity.</p>`,
            `<h2>Step 2: ...</h2>`,
            `...`,
            ``,
            `Use only HTML. No markdown.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 2000,
            temperature: 0.75,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generatePresellTeaseStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level copywriter and persuasive marketing strategist. Your specialty is teasing irresistible offers without revealing everything upfront. You write in a style that builds anticipation, stirs desire, and leads the reader toward a powerful CTA. response should be little longer and also response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with writing a **Presell Offer Tease** that builds curiosity and desire while hinting at the upcoming offer. response should be little longer`,
            ``,
            `## 🧩 Provided Inputs details by user, include this while generating response`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint Details`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            `🎯 Objective: Tease the offer in a compelling way that makes the reader *want to know more*. This is not the full pitch—just the setup.`,
            ``,
            `✍️ Guidelines:`,
            `- Use emotionally resonant language.`,
            `- Hint at the transformation or benefits, but don’t reveal the full offer.`,
            `- Common formats: “Imagine if…”, “What if you could…”, “Soon, you’ll discover…”`,
            `- Lead naturally into a CTA like “Stay tuned” or “You’ll see exactly how in a moment…”`,
            ``,
            `🔁 Output Format:`,
            `- Use Valid HTML Elements  <html> <body>`,
            `<div class="presell-tease">Your tease goes here in 3–5 sentences max</div>`,
            ``,
            `Use only HTML. No markdown or intro text.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 1000,
            temperature: 0.75,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateSalesFunnelLeadStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-converting direct response copywriter specializing in sales funnels. Your expertise lies in crafting irresistible opening leads that grab attention, create intrigue, and emotionally connect with the reader in the first few seconds. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing a **Sales Funnel Lead** — the opening section that hooks the reader and sets the tone for the rest of the funnel.`,
            ``,
            `## 🎯 Objective`,
            `Create an attention-grabbing hook that builds curiosity and makes the reader feel like this offer is exactly what they need right now.`,
            ``,
            `## ✨ Provided Inputs provided by the user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 🔧 Blueprint Details`,
            `${formattedBlueprint}`,
            ``,
            `## 🧠 Writing Guidelines`,
            `- Start with a bold statement, emotional hook, or a powerful “what if” question.`,
            `- Make the problem and pain point immediately relatable.`,
            `- Use second-person (“you”) voice to create intimacy and urgency.`,
            `- Tease the transformation or result without giving away too much.`,
            `- Avoid generic or passive language.`,
            ``,
            `## 📦 Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `<div class="sales-funnel-lead">Your compelling lead paragraph here (approx. 4–6 sentences)</div>`,
            ``,
            `Use only HTML. No markdown or intro text.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 1000,
            temperature: 0.78,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generateFalseSolutionsStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a persuasive direct response copywriter who specializes in sales psychology and sales funnels. Your job is to write a False Solutions section — exposing ineffective or misleading methods people commonly try before they discover the real, proven offer. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing a **False Solutions** section of a sales funnel.`,
            ``,
            `## 🎯 Objective`,
            `Build tension and credibility by highlighting 5-6 common "false solutions" your ideal audience has likely tried and failed with.`,
            ``,
            `## 🧠 Writing Strategy`,
            `- Mention each false solution with a clear reason why it doesn’t work.`,
            `- Relate emotionally to the audience’s frustration and wasted effort.`,
            `- Bridge toward your solution by hinting at what actually works.`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `<section class="false-solutions">
      <p>Paragraph 1: Emotional context – “You’ve probably tried…”</p>
      <ul>
        <li>❌ False Solution #1 – What it is + why it fails</li>
        <li>❌ False Solution #2 – What it is + why it fails</li>
        <li>❌ False Solution #3 – Optional – What it is + why it fails</li>
      </ul>
      <p>Transition to real solution: “The truth is, what actually works is...”</p>
    </section>`,
            ``,
            `Only return valid HTML inside a <section>. No markdown.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.75,
            max_tokens: 900,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateRealSolutionStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-converting direct response copywriter who specializes in writing sales funnels. Your task is to write the Real Solution section — the breakthrough method or unique mechanism that actually delivers results. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing the **Real Solution** section of a sales funnel.`,
            ``,
            `## 🎯 Objective`,
            `Reveal the unique method or big idea that finally solves the reader's core problem.`,
            ``,
            `## 🧠 Writing Strategy`,
            `- Build contrast with previous failures (from false solutions).`,
            `- Introduce your unique mechanism or proven approach.`,
            `- Keep it simple, clear, and exciting.`,
            `- Build trust and curiosity without giving away the entire method.`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `- if you use css, only use inline css`,
            `<section>
      <p>Paragraph 1: Set the scene – “Here’s what actually works...”</p>
      <p>Paragraph 2: Introduce your unique mechanism or framework.</p>
      <p>Paragraph 3: Why it works and what makes it different.</p>
      <p>Optional CTA: “And in a second, I’ll show you how to start using this...”</p>
    </section>`,
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
            temperature: 0.75,
            max_tokens: 900,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateSolutionStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a persuasive sales funnel copywriter. Your task is to clearly present the main solution that addresses the customer’s pain point. This solution should be explained in a way that builds trust, feels logical, and creates excitement about what's coming. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing the **Solution** section of a high-converting sales funnel.`,
            ``,
            `## ✨ Objective`,
            `Present the actual product, method, or strategy that solves the reader's core problem.`,
            ``,
            `## 💡 Writing Strategy`,
            `- Transition from the pain/frustration to your clear, confident solution.`,
            `- Focus on the transformation or result, not just features.`,
            `- Use emotional and practical appeal — people want to believe it’ll finally work.`,
            `- Be specific but not overwhelming — avoid overexplaining.`,
            ``,
            `## 🔽 Provided Inputs details by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `- if you use css, only use inline css`,
            `<section">
      <p>Paragraph 1: Introduce the solution with confidence.</p>
      <p>Paragraph 2: Explain how it works or what’s different about it.</p>
      <p>Paragraph 3: Reassure the reader – it's simple, doable, and proven.</p>
      <p>Optional CTA: Tease the offer or next step.</p>
    </section>`,
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
            temperature: 0.72,
            max_tokens: 1000,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateObjectionHandlerStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-level sales copywriter skilled at handling objections in sales funnels. Your job is to anticipate and answer buyer doubts with empathy, clarity, and confidence. Your copy should create trust, eliminate fear, and reinforce the value of the solution. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are writing the **Objection Handling** section of a persuasive sales funnel.`,
            ``,
            `## 🧠 Objective`,
            `Address common objections or hesitations (cost, time, risk, results, etc.) in a way that builds trust and removes friction.`,
            ``,
            `## 🛠 Strategy`,
            `- Identify the top 3–5 common objections.`,
            `- Address each with a reassuring and benefit-driven response.`,
            `- Use logic + empathy — don't argue, understand and neutralize.`,
            `- Reinforce what they gain, not what they lose.`,
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
            `<section>
      <h3>Common Objections & Honest Answers</h3>
      <ul>
        <li><strong>Objection #1:</strong> [What if I don’t have time?]<br><em>Response:</em> [That's exactly why this is built for busy people — results with minimal effort.]</li>
        <li><strong>Objection #2:</strong> [It’s too expensive]<br><em>Response:</em> [Compared to what it’s costing you to stay stuck, this is a fraction.]</li>
        <li><strong>Objection #3:</strong> [What if it doesn’t work for me?]<br><em>Response:</em> [We built this with a guarantee, so the only risk is not trying.]</li>
      </ul>
    </section>`,
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
            temperature: 0.72,
            max_tokens: 1000,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateOfferIntroStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-converting sales copywriter specializing in offer introductions that transition from emotional tension to confident action. Your goal is to introduce the solution (offer) in a way that feels natural, valuable, and exciting without being overly salesy.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are now writing the **Offer Introduction** section for a compelling sales funnel.`,
            ``,
            `## 🎯 Goal`,
            `Bridge the emotional/mental journey from “I want a solution” to “Here's exactly what you need”.`,
            ``,
            `## 🧩 Copy Strategy`,
            `- Reflect the pain/desire they've experienced.`,
            `- Signal the shift from problem to solution.`,
            `- Introduce the name and essence of the offer.`,
            `- Make it feel like the natural next step.`,
            `- Use emotional momentum and relief — not hype.`,
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
            `<section>
      <h3>Introducing [Your Offer Name]</h3>
      <p>You’ve seen what doesn’t work. You’ve felt the frustration. Now, imagine a path forward that actually makes sense...</p>
      <p>[Offer Name] is the [type of solution] designed specifically for [target audience] who are tired of [problem].</p>
      <p>Let’s show you what’s inside.</p>
    </section>`,
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
            temperature: 0.7,
            max_tokens: 800,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateTestimonialsStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a high-converting sales copywriter who specializes in writing believable, emotionally resonant, and persuasive testimonials. You write realistic customer feedback that builds trust, addresses objections, and proves that the product or service delivers on its promise.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are now writing the **Testimonials** section of a persuasive sales funnel.`,
            ``,
            `## 🎯 Goal`,
            `Provide realistic and emotionally resonant customer testimonials that address skepticism, reinforce value, and showcase specific results or transformations.`,
            ``,
            `## 🧩 Copy Strategy`,
            `- Use diverse testimonial types: before-after, relief-based, unexpected benefit, objection-busting.`,
            `- Keep each testimonial 3–5 sentences long.`,
            `- Use real-sounding names and titles (or indicate anonymous if appropriate).`,
            `- Reflect language that the audience might actually use.`,
            `- No generic praise; focus on outcomes, emotions, and specifics.`,
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
            `<section>
      <div>
        <p>“Before [Offer Name], I was stuck in [problem state]...”</p>
        <p>— Sarah M., Freelance Developer</p>
      </div>
      <div>
        <p>“I honestly didn’t believe it at first, but after using [Offer Name] for just two weeks...”</p>
        <p>— James D., Small Business Owner</p>
      </div>
      ...
    </section>`,
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
            temperature: 0.8,
            max_tokens: 1200,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generatePriceAndGuaranteeStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level sales funnel copywriter with a focus on pricing psychology and risk reversal. You write compelling offer pricing paired with iron-clad, believable guarantees to reduce buyer friction and increase conversions. You balance urgency, clarity, and value perception. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are now writing the **Price + Guarantee** section of a persuasive sales funnel.`,
            ``,
            `## 🎯 Goal`,
            `Clearly state the price, anchor the value (price justification), and offer a risk-reducing guarantee.`,
            ``,
            `## 🧩 Copy Strategy`,
            `- Frame price as a no-brainer vs. the cost of inaction.`,
            `- Use price contrast (e.g., "Normally $500, now only $97").`,
            `- Show what’s included at that price (value stacking).`,
            `- Include a strong, believable guarantee (money-back, try-before-buy, etc.).`,
            `- Use urgency or deadline-based pricing if applicable.`,
            ``,
            `## 🔽 Provided Inputs by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 📘 Blueprint`,
            `${formattedBlueprint}`,
            ``,
            `## ✅ Output Format`,
            `- Use Valid HTML Elements  <html> <body>`,
            `- if you use css, only use inline css`,
            `<section >
      <div >
        <h2>Just $97 – Limited-Time Offer</h2>
        <p>Get lifetime access to [Offer Name], normally priced at $497.</p>
        <p>Includes: [Feature 1], [Feature 2], [Bonus 1]</p>
      </div>
      <div >
        <h3>30-Day No-Risk Guarantee</h3>
        <p>Try [Offer Name] for a full 30 days. If you don’t see [Expected Result], just email us and we’ll refund every cent. No questions asked.</p>
      </div>
    </section>`,
            ``,
            `Only return valid HTML inside a <html> <body>. No markdown no intro text.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            temperature: 0.75,
            max_tokens: 1200,
        };





        return await this.makeStreamingRequest(request, onProgress);
    }



    async generateBonusesStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level sales copywriter with expertise in crafting irresistible bonus offers that amplify perceived value and drive urgency. Your writing combines persuasive storytelling with conversion psychology to make bonuses feel exclusive, relevant, and essential.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are now writing the **Bonuses** section of a persuasive sales funnel.`,
            ``,
            `## 🎯 Goal`,
            `List 5-6 compelling bonuses that dramatically increase the perceived value of the main offer.`,
            ``,
            `## 🧩 Copy Strategy`,
            `- Each bonus should feel exclusive, time-sensitive, and relevant to the core offer.`,
            `- Present value (e.g., "$197 value") to anchor perceived worth.`,
            `- Use engaging bonus names and benefits-driven descriptions.`,
            `- Show how each bonus helps them get results faster, easier, or better.`,
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
            `<section >
      <h2>💎 Get These Free Bonuses When You Join Today</h2>
      <div >
        <div >
          <h3>Bonus #1: [Bonus Title] ($197 Value)</h3>
          <p>[Short, persuasive bonus description focused on outcome or shortcut it provides]</p>
        </div>
        <div >
          <h3>Bonus #2: [Bonus Title] ($97 Value)</h3>
          <p>[Bonus description]</p>
        </div>
        <div >
          <h3>Bonus #3: [Bonus Title] ($149 Value)</h3>
          <p>[Bonus description]</p>
        </div>
        <!-- Add more bonuses if needed -->
      </div>
    </section>`,
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
            temperature: 0.75,
            max_tokens: 1200,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }


    async generateCloseStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void
): Promise<string> {
  const systemPrompt = `You are a top-tier direct response copywriter focused on closing sales with confidence, urgency, and irresistible reasoning. Your closing copy summarizes key benefits, overcomes final doubts, and motivates immediate action with clarity and enthusiasm.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
    `You are now writing the **Closing** section of a persuasive sales funnel.`,
    ``,
    `## 🎯 Goal`,
    `Give prospects every compelling reason to say YES and purchase immediately.`,
    ``,
    `## 🧩 Copy Strategy`,
    `- Recap the biggest benefits and transformation.`,
    `- Remind them of the risk-free guarantee.`,
    `- Overcome any last-minute hesitation with empathy.`,
    `- Use clear calls to action and urgency without pressure.`,
    ``,
    `## 🔽 Provided Inputs by user`,
    `${formattedCategoryInputs}`,
    ``,
    `## 📘 Blueprint`,
    `${formattedBlueprint}`,
    ``,
    `## ✅ Output Format`,
      `- Use Valid HTML Elements  <html> <body>`,
            `- if you use css, only use inline css`,
    `<section >
      <h2>Ready to Transform Your [Problem Area]?</h2>
      <p>You’ve seen what works and what doesn’t. Now it’s time to take action and finally get the results you deserve.</p>
      <p>With our [Guarantee Type], there’s zero risk—only the opportunity to change your life/business.</p>
      <p>Don’t wait. Join [Offer Name] today and start your journey toward [Desired Outcome].</p>
      <p><strong>Click the button below to get started now!</strong></p>
    </section>`,
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
    temperature: 0.75,
    max_tokens: 900,
  };

  return await this.makeStreamingRequest(request, onProgress);
}


}

export const salesFunnelService = new SalesFunnelService()