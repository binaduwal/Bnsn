import { DeepSeekRequest } from "../../types";
import { BlueprintValue, ProjectCategoryValue } from "../../types/project";
import { DeepSeekService } from "../deepseek";

class LinkedInProfileService extends DeepSeekService {

    async generateLinkedInEntrepreneurProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are an expert LinkedIn profile copywriter specializing in personal branding, lead generation, and storytelling for entrepreneurs and business owners. You craft compelling profiles that highlight an individual's unique strengths, expertise, business value proposition, and social proof. Your tone is confident, professional, human, and persuasive — designed to attract investors, clients, and collaborators. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body> `;

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
            `You are tasked with generating a high-converting LinkedIn profile for an entrepreneur.`,
            ``,
            `## 🎯 Objective`,
            `Craft a LinkedIn profile that builds personal authority, communicates business impact, and drives B2B leads.`,
            ``,
            `## 🧩 Provided Inputs`,
            `Below are contextual values and information provided by the user. Use these to determine the angle, tone, and content of the LinkedIn profile.`,
            ``,
            `${formattedCategoryInputs}`,
            ``,
            `## 👤 Personal & Brand Information`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A powerful one-liner USP that grabs attention and positions the entrepreneur.`,
            `2. <p>About Section</p> – A brief story-driven summary that showcases the person’s journey, mission, and what makes them unique.`,
            `3. <p>Business Impact Section</p> – How the entrepreneur helps businesses or clients succeed (include measurable value if possible).`,
            `4. <p>Testimonial Section</p> – Write a sample third-person testimonial from a happy client or collaborator to add credibility.`,
            `5. <p>Call to Action</p> – A friendly prompt to connect or message for collaboration, partnership, or services.`,
            ``,
            `- Use valid HTML tags like <html> <body> <div>, <h1>, <h2>, <p>, <ul>, <strong>.`,
            `- Do NOT include markdown or explanations.`,
            `- Write in a clear, bold, and approachable tone.`
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

    async generateLinkedInWhatWeDoProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a professional LinkedIn copywriter skilled in personal branding, business storytelling, and lead generation for entrepreneurs. You write persuasive LinkedIn profiles that showcase what the entrepreneur or business does and highlight their biggest achievement to build authority and attract high-quality leads. Your tone is clear, confident, benefit-focused, and friendly. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with writing a lead-generating LinkedIn profile for an entrepreneur.`,
            ``,
            `## 🎯 Objective`,
            `The profile should highlight what the entrepreneur/business does and their biggest achievement to create a powerful, credible brand image.`,
            ``,
            `## 🧩 Details Provided by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 👤 Personal & Brand Information`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following profile content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A short, sharp summary of what the entrepreneur does.`,
            `2. <p>What We Do Section</p> – A benefit-focused paragraph explaining the service, product, or business value.`,
            `3. <p>Biggest Achievement Section</p> – A bold paragraph highlighting the biggest business win or milestone (include metrics if provided).`,
            `4. <p>About Section</p> – A story-driven background on the entrepreneur and their mission.`,
            `5. <p>Call to Action</p> – A friendly invitation to connect, collaborate, or start a conversation.`,
            ``,
            `- Use valid HTML tags like <html> <body> <div>, <h1>, <h2>, <p>, <strong>, <ul>, etc.`,
            `- DO NOT include markdown or explanations.`,
            `- Tone should be friendly yet authoritative.`,
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 3500,
            temperature: 0.75,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generateLinkedInOtherAchievementsProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a senior-level LinkedIn personal brand strategist and profile copywriter. You specialize in helping entrepreneurs build credibility, thought leadership, and trust by showcasing multiple professional achievements. Your tone is persuasive yet professional, and your structure is optimized for LinkedIn profile discovery, engagement, and inbound leads. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with writing a high-quality LinkedIn profile for an entrepreneur.`,
            ``,
            `## 🎯 Objective`,
            `Craft a profile that builds professional credibility through a list of diverse and relevant achievements.`,
            ``,
            `## 🧩 Provided Inputs`,
            `Below are contextual values provided by the user, including personal info and achievements.`,
            ``,
            `${formattedCategoryInputs}`,
            ``,
            `## 👤 Personal & Brand Information`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A compelling headline that positions the entrepreneur (include role + mindset if possible).`,
            `2. <p>About Section</p> – A paragraph introducing the entrepreneur’s journey and mission.`,
            `3. <h2>Key Achievements</h2> – Use a <ul> list to highlight 3–5 achievements (include metrics, clients, milestones, recognition, etc.).`,
            `4. <p>Closing Section</p> – A statement summarizing their vision and inviting connection or collaboration.`,
            ``,
            `- Use valid HTML tags only: <html> <body>  <div>, <h1>, <h2>, <p>, <ul>, <li>, <strong>`,
            `- DO NOT include markdown or explanation.`,
            `- Write with clarity, warmth, and credibility.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 3500,
            temperature: 0.7,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generateLinkedInSkillsBasedProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a professional LinkedIn copywriter focused on building personal brands through a skills-first approach. You write profiles that highlight an entrepreneur’s top skills and show how those skills drive business value. Your writing is confident, benefit-oriented, and optimized to attract leads, collaborators, and recruiters.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

        const formattedBlueprint = blueprintValue
            .map((section) => {
                const values = section.values
                    .map((val) => `- ${val.key}: ${val.value}`)
                    .join("\n");
                return `### ${section.title}\n${values}`;
            })
            .join("\n\n");

        const formattedCategoryInputs = projectCategoryValue
            ?.map((item) => `- ${item.key}: ${item.value}`)
            .join("\n");

        const userPrompt = [
            `You are tasked with writing a high-converting LinkedIn profile for an entrepreneur with a skills-first approach.`,
            ``,
            `## 🎯 Objective`,
            `Craft a profile that builds authority around specific skills and how they create results for clients, companies, or communities.`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs || ''}`,
            ``,
            `## 👤 Personal & Skills Data`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following profile content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A clear, bold headline that highlights the entrepreneur’s top 2–3 core skills.`,
            `2. <p>Skills Section</p> – A paragraph elaborating how these skills are applied professionally and what value they bring.`,
            `3. <h2>Core Skills</h2> – A bullet list (<ul>) of top 5–7 skills.`,
            `4. <p>About Section</p> – A brief professional summary that blends personal mission and skills mastery.`,
            `5. <p>CTA Section</p> – Encourage profile viewers to connect, collaborate, or inquire about services.`,
            ``,
            `- Use only valid HTML: <html> <body> <div>, <h1>, <h2>, <ul>, <li>, <p>, <strong>`,
            `- DO NOT include markdown or explanations.`,
            `- Maintain a confident, expertise-driven tone.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 3500,
            temperature: 0.7,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }

    async generateLinkedInExperienceBasedProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a professional LinkedIn copywriter who specializes in experience-based personal branding. You craft profiles that emphasize an entrepreneur’s years of work, industries served, leadership roles, and project journeys. Your writing builds trust and credibility by showcasing depth, adaptability, and long-term value. Your tone is formal yet warm, confident, and positioned for professional impact.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

        const formattedBlueprint = blueprintValue
            .map((section) => {
                const values = section.values
                    .map((val) => `- ${val.key}: ${val.value}`)
                    .join("\n");
                return `### ${section.title}\n${values}`;
            })
            .join("\n\n");

        const formattedCategoryInputs = projectCategoryValue?.map((item) => `- ${item.key}: ${item.value}`)
            .join("\n");

        const userPrompt = [
            `You are tasked with writing a LinkedIn profile for an entrepreneur based on their experience.`,
            ``,
            `## 🎯 Objective`,
            `Craft a profile that builds professional trust and visibility through the entrepreneur's years of experience, roles, industries, and notable career evolution.`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs || ''}`,
            ``,
            `## 👤 Experience-Based Data`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following profile content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A headline that emphasizes years of experience and domain (e.g., “15+ Years in Tech Leadership & Product Strategy”).`,
            `2. <p>Experience Overview</p> – Paragraph summarizing their journey across industries, companies, or roles.`,
            `3. <h2>Key Roles & Projects</h2> – Use <ul> to list 3–5 impactful roles, titles, or projects.`,
            `4. <p>About Section</p> – Brief story-driven paragraph about how the experience shapes their current mission or business.`,
            `5. <p>CTA Section</p> – Friendly invitation to connect, collaborate, or discuss opportunities.`,
            ``,
            `- Use only valid HTML: <html> <body> <div>, <h1>, <h2>, <ul>, <li>, <p>, <strong>`,
            `- DO NOT include markdown or explanation.`,
            `- Keep tone professional, credible, and forward-looking.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 3500,
            temperature: 0.7,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generateLinkedInBenefitsBasedProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a professional LinkedIn profile copywriter focused on customer-first, benefits-driven storytelling. You specialize in writing personal brand profiles that clearly communicate the business outcomes and transformation a founder or entrepreneur helps deliver. Your tone is confident, compelling, and benefit-focused.  response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

        const formattedBlueprint = blueprintValue
            .map((section) => {
                const values = section.values
                    .map((val) => `- ${val.key}: ${val.value}`)
                    .join("\n");
                return `### ${section.title}\n${values}`;
            })
            .join("\n\n");

        const formattedCategoryInputs = projectCategoryValue
            ?.map((item) => `- ${item.key}: ${item.value}`)
            .join("\n");

        const userPrompt = [
            `You are tasked with generating a LinkedIn profile for an entrepreneur with a benefits-driven focus.`,
            ``,
            `## 🎯 Objective`,
            `Write a profile that clearly communicates the *outcomes, results, and value* that clients or partners gain from working with this entrepreneur.`,
            ``,
            `## 🧩 Provided Inputs`,
            `${formattedCategoryInputs || ''}`,
            ``,
            `## 👤 Personal & Business Information`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following profile content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – A compelling benefit-driven headline (e.g., "Helping B2B Brands Scale With Conversion-Focused Funnels").`,
            `2. <p>Benefits Section</p> – A paragraph outlining the top benefits/results delivered (client outcomes, business growth, speed, profitability, etc.).`,
            `3. <h2>Who I Help</h2> – Use <ul> to list 3–5 types of people/companies this entrepreneur typically serves.`,
            `4. <p>About Section</p> – A concise intro with a personal angle plus how those benefits are achieved.`,
            `5. <p>CTA Section</p> – A friendly call to action to connect, collaborate, or start a conversation.`,
            ``,
            `- Use valid HTML tags only: <html> <body> <div>, <h1>, <h2>, <p>, <ul>, <li>, <strong>`,
            `- DO NOT include markdown or explanations.`,
            `- Tone should be benefits-first, persuasive, yet approachable.`
        ].join("\n");

        const request: DeepSeekRequest = {
            model: this.defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: true,
            max_tokens: 3500,
            temperature: 0.7,
        };

        return await this.makeStreamingRequest(request, onProgress);
    }
    async generateLinkedInGeneralProfileStream(
        blueprintValue: BlueprintValue[],
        projectCategoryValue: ProjectCategoryValue[],
        onProgress?: (chunk: string) => void
    ): Promise<string> {
        const systemPrompt = `You are a highly skilled LinkedIn profile copywriter and personal brand strategist. You specialize in crafting well-rounded, compelling profiles that blend storytelling, credibility, expertise, and lead generation strategy. Your tone is professional yet approachable. You adapt to the user’s focus — whether they emphasize skills, achievements, experience, or transformation — and highlight their value in a clear, engaging format. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
            `You are tasked with writing a full LinkedIn profile for an entrepreneur.`,
            ``,
            `## 🎯 Objective`,
            `Create a versatile, well-structured LinkedIn profile that communicates authority, mission, and value — using any mix of skills, experience, achievements, benefits, or testimonials provided.`,
            ``,
            `## 🧩 Provided details by user`,
            `${formattedCategoryInputs}`,
            ``,
            `## 👤 Personal & Brand Info`,
            `${formattedBlueprint}`,
            ``,
            `---`,
            ``,
            `Please generate the following content in valid HTML format:`,
            ``,
            `1. <h1>Headline</h1> – One strong line that captures the user's identity + core value.`,
            `2. <p>About Section</p> – A compelling summary of their mission, story, and what they offer.`,
            `3. <h2>Key Highlights</h2> – A bullet list (<ul>) of skills, wins, or credibility markers.`,
            `4. <p>What They Do</p> – A paragraph describing their current business or service (if provided).`,
            `5. <p>Social Proof</p> – If testimonials are present, include a sample testimonial in third-person.`,
            `6. <p>Closing Section</p> – Invite viewers to connect, partner, or message.`,
            ``,
            `- Use only valid HTML: <html> <body> <div>, <h1>, <h2>, <ul>, <li>, <p>, <strong>`,
            `- DO NOT include markdown or explanation.`,
            `- Use professional and flexible language suited for a wide audience.`,
            `- If input is missing for any section, gracefully omit that section.`
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
async generatePersonalLinkedInProfileStream(
  blueprintValue: BlueprintValue[],
  projectCategoryValue: ProjectCategoryValue[],
  onProgress?: (chunk: string) => void
): Promise<string> {
  const systemPrompt = `You are a senior LinkedIn profile strategist and copywriter, skilled in crafting personal brand-driven profiles that resonate with authenticity, credibility, and clarity. You help professionals express their mission, personality, and unique value proposition in a way that builds trust and inspires action. response should be start directly from <html> and end with </html>, no intro texts, and content must be inside <body>`;

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
    `You are tasked with writing a **first-person LinkedIn profile** for a personal brand.`,
    ``,
    `## 🔍 Input Overview`,
    `Use the following inputs to build a powerful, authentic profile:`,
    ``,
    `### Category Inputs`,
    `${formattedCategoryInputs}`,
    ``,
    `### Personal Brand Blueprint`,
    `${formattedBlueprint}`,
    ``,
    `---`,
    `## ✍️ Writing Guidelines`,
    `- Use **first person** throughout (e.g., "I help...", "My mission is...").`,
    `- Begin with a **hooking headline** that captures the user's essence and core value.`,
    `- Make it professional, authentic, and easy to relate to.`,
    `- Emphasize purpose, values, and what drives them.`,
    `- Use clean storytelling and clear sentence structure.`,
    `- Do not use emojis, hashtags, or markdown.`,
    `- Keep formatting clean and limited to basic HTML only.`,
    ``,
    `## 🧱 Output Format (Use Valid HTML Elements  <html> <body> )`,
    `<h1>Headline</h1> – One-liner that defines the person and their unique value.`,
    `<p>About</p> – Summary of who they are, what they believe in, and what they bring.`,
    `<h2>Key Highlights</h2> – A bullet list (<ul><li>) showcasing skills, achievements, or credibility.`,
    `<p>What They Do</p> – A brief overview of current role, project, or service (if provided).`,
    `<p>Social Proof</p> – If testimonial info is present, include one in third-person format.`,
    `<p>Closing</p> – Encourage connection or collaboration in a warm tone.`,
    ``,
    `If a section lacks enough data, skip it naturally.`,
    `Ensure the final output is only clean HTML (no markdown or explanation).`,
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



}

export const linkedInProfileService = new LinkedInProfileService()
