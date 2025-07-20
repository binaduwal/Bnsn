import axios from 'axios';
import { DeepSeekRequest, DeepSeekResponse } from '../types';
import { createError } from '../middleware/errorHandler';
import { ICategory } from '../models/Category';
import 'dotenv/config'
import { BlueprintValue, ProjectCategoryValue } from '../types/project';

export class DeepSeekService {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    this.defaultModel = 'deepseek-chat';

    if (!this.apiKey) {
      console.warn('DeepSeek API key not configured. AI features will be disabled.');
    }
  }

  private async makeRequest(data: DeepSeekRequest): Promise<DeepSeekResponse> {
    if (!this.apiKey) {
      throw createError('DeepSeek API key not configured', 500);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(
          `DeepSeek API error: ${error.response.data?.error?.message || error.response.statusText}`,
          error.response.status
        );
      } else if (error.request) {
        throw createError('DeepSeek API is unreachable', 503);
      } else {
        throw createError('Failed to communicate with DeepSeek API', 500);
      }
    }
  }

  async generateBlueprint(
    feedBnsn: string,
    offerType: string,
    categories: ICategory[]
  ): Promise<any> {
    const categoryList = categories.map(cat => ({
      title: cat.title,
      description: cat.description,
      fields: cat.fields.map(f => ({ fieldName: f.fieldName, fieldType: f.fieldType }))
    }));

    const systemPrompt = `You are an expert business strategist. You must respond with a JSON array of category objects. Each category object must have:
  - title: string (must match one of the provided categories)
  - description: string
  - fields: array of objects with fieldName and value properties
  
  Available categories: ${JSON.stringify(categoryList, null, 2)}
  
  CRITICAL: Return ONLY the JSON array without any markdown formatting, explanations, or code blocks. Start directly with [ and end with ].`;

    const userPrompt = `Create a comprehensive business blueprint for:
  Business Description: ${feedBnsn}
  Offer Type: ${offerType}
  
  Return structured data using the provided categories. Each field should have meaningful content related to the business.
  
  IMPORTANT: Return pure JSON only - no markdown, no explanations, no code blocks.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    let content = response.choices[0]?.message?.content || '';

    // Clean the response to extract JSON
    content = this.cleanJsonResponse(content);

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw AI response:', response.choices[0]?.message?.content);
      return [];
    }
  }

  // Add this helper method to clean the response
  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    content = content.replace(/```json\s*/g, '');
    content = content.replace(/```\s*/g, '');

    // Remove any text before the first [
    const startIndex = content.indexOf('[');
    if (startIndex !== -1) {
      content = content.substring(startIndex);
    }

    // Remove any text after the last ]
    const endIndex = content.lastIndexOf(']');
    if (endIndex !== -1) {
      content = content.substring(0, endIndex + 1);
    }

    // Clean up any remaining whitespace
    content = content.trim();

    return content;
  }

  async generateEmailContent(blueprint: any, campaignType: string = 'promotional'): Promise<string> {
    const systemPrompt = `You are an expert email marketing copywriter. Create compelling email content based on the provided blueprint information.
    Focus on:
    1. Engaging subject lines
    2. Personalized content
    3. Clear call-to-actions
    4. Value-driven messaging
    5. Professional tone that matches the brand`;

    const userPrompt = `Create email campaign content for:
    Campaign Type: ${campaignType}
    Blueprint Data: ${JSON.stringify(blueprint)}
    
    Please provide a complete email with subject line, body content, and call-to-action.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async cloneCopy(originalText: string, blueprint: string, maxWords: number = 2500): Promise<string> {
    const systemPrompt = `You are an expert copywriter specializing in adapting and cloning existing copy while maintaining the original style and effectiveness.
    Your task is to create new copy that:
    1. Maintains the original tone and style
    2. Adapts to the new context provided
    3. Preserves the persuasive elements
    4. Ensures brand consistency
    5. Optimizes for engagement`;

    const userPrompt = `Clone and adapt this copy for a new context:
    
    Original Copy: ${originalText}
    New Context/Blueprint: ${blueprint}
    Maximum Words: ${maxWords}
    
    Please create adapted copy that maintains the original's effectiveness while fitting the new context.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: Math.min(maxWords * 1.5, 3000),
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async suggestImprovements(content: string, context: string): Promise<string> {
    const systemPrompt = `You are an expert content strategist and copywriter. Analyze the provided content and suggest specific improvements.
    Focus on:
    1. Clarity and readability
    2. Persuasiveness and engagement
    3. Call-to-action optimization
    4. Target audience alignment
    5. SEO and conversion optimization`;

    const userPrompt = `Analyze this content and provide specific improvement suggestions:
    
    Content: ${content}
    Context: ${context}
    
    Please provide actionable suggestions for improving this content.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.5,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }


  async analyzeProject(projectData: any): Promise<string> {
    const systemPrompt = `You are an expert business analyst. Analyze the provided project data and provide insights on:
    1. Project strengths and opportunities
    2. Target market analysis
    3. Competitive positioning
    4. Growth strategies
    5. Risk assessment and mitigation`;

    const userPrompt = `Analyze this project and provide strategic insights:
    
    Project Data: ${JSON.stringify(projectData)}
    
    Please provide a comprehensive analysis with actionable recommendations.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateEmail(blueprintValue: BlueprintValue[], projectCategoryValue: ProjectCategoryValue[]): Promise<string> {
    const systemPrompt = `You are an expert email copywriter. Create high-converting emails that drive clicks, engagement, and conversions. Use proven psychological techniques, personalization, and strong CTAs for different email types like sales, follow-up, nurture, or broadcast.`;

    const formattedBlueprint = blueprintValue.map(section => {
      const values = section.values
        .map(val => `- ${val.key}: ${val.value}`)
        .join('\n');
      return `### ${section.title}\n${values}`;
    }).join('\n\n');

    const formattedCategoryInputs = projectCategoryValue.map(item => {
      return `- ${item.key}: ${item.value}`;
    }).join('\n');

    const userPrompt = `Generate a professional, engaging email based on the following user inputs:

## Blueprint Information
${formattedBlueprint}

## Email-Specific Details
${formattedCategoryInputs}

Please include:
- A compelling subject line
- Preheader text
- Email body with personalized tone and strong CTA

Ensure the email is optimized for marketing engagement and conversion, and fits best practices for the type of content described.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }


  async generateBookDraft(bookData: any): Promise<string> {
    const systemPrompt = `You are a professional book ghostwriter. Based on the provided book data, help structure and write an engaging, coherent book. Focus on clear chapter organization, tone consistency, and value delivery to the reader.`;

    const userPrompt = `Generate a complete book outline and initial content draft:

Book Data: ${JSON.stringify(bookData)}

Provide:
1. Suggested title and subtitle
2. Book outline with chapter breakdown
3. Introduction
4. Sample content for the first 2 chapters (or more depending on book length)

Ensure the tone fits the intended audience and genre. Word count goal: 5,000–50,000 words.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateAdCopy(adData: any): Promise<string> {
    const systemPrompt = `You are a world-class ad copywriter and digital marketer. Create high-converting ad copy based on the provided information. Your goal is to maximize engagement and conversion across platforms such as Facebook, Instagram, YouTube, and TikTok. Focus on clear messaging, emotional triggers, and platform-specific tone.`;

    const userPrompt = `Generate compelling ad copy for this campaign:

Ad Data: ${JSON.stringify(adData)}

Provide at least 3 variations tailored for different platforms (Facebook, Instagram, YouTube, TikTok) with strong hooks, CTAs, and engagement-oriented language.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateSalesPageFunnel(funnelData: any): Promise<string> {
    const systemPrompt = `You are an expert direct response marketer and funnel builder. Create a complete high-converting sales funnel that includes Facebook/Instagram ads, a persuasive sales page, and a full email sequence.`;

    const userPrompt = `Generate a full sales funnel for this offer:

Funnel Data: ${JSON.stringify(funnelData)}

Provide:
1. 2-3 Facebook/Instagram ad copies
2. Long-form sales page content with headline, benefits, testimonials, objections, and CTA
3. Email sequence (minimum 3 emails): intro, follow-up, urgency/offer reminder
4. Bonus: upsell ideas or tripwire suggestions

Ensure the funnel flows naturally, addresses objections, and drives conversions.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateLinkedInProfile(profileData: any): Promise<string> {
    const systemPrompt = `You are a professional LinkedIn strategist and personal brand copywriter. Create a LinkedIn profile that attracts leads, highlights personal achievements, and clearly communicates the user’s business value and offer.`;

    const userPrompt = `Generate a high-converting LinkedIn profile based on the following information:

Profile Data: ${JSON.stringify(profileData)}

Include:
1. Headline
2. Summary/About section
3. Experience highlights
4. Featured section suggestions
5. Call-to-action (for DMs or links)

Focus on lead generation and credibility. Use persuasive, concise language that reflects personal and business branding.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1800,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateBookSalesFunnel(funnelData: any): Promise<string> {
    const systemPrompt = `You are a marketing funnel strategist and expert copywriter for self-publishers. Create a complete book sales funnel that includes a compelling back cover, persuasive sales letters, platform-specific ad copy, and other relevant assets to sell the book effectively.`;

    const userPrompt = `Generate a book sales funnel based on this data:

Book Funnel Data: ${JSON.stringify(funnelData)}

Deliverables:
1. Back cover copy
2. Short and long-form sales letters
3. Ad variations for Facebook, Instagram, and Google
4. Call-to-action suggestions
5. Optional: bonus ideas and lead magnets

Tailor everything for book buyers and self-publishing platforms.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }


  async generateOrderBumpCopy(bumpData: any): Promise<string> {
    const systemPrompt = `You are an expert in conversion-focused copywriting. Craft persuasive, benefit-driven order bump copy that adds irresistible value during the checkout process. Model your language after top-performing checkout pages.`;

    const userPrompt = `Create order bump copy based on the following product/offer details:

Order Bump Data: ${JSON.stringify(bumpData)}

Requirements:
1. Compelling one-liner headline
2. 2–3 short bullet benefits or outcome-driven points
3. A CTA that encourages impulse buy

Tone: persuasive, benefit-focused, and concise. Ideal for checkout upsells.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }


  async generatePressRelease(releaseData: any): Promise<string> {
    const systemPrompt = `You are a professional PR writer. Create press releases that follow journalistic standards, build authority, and drive media interest.`;

    const userPrompt = `Write a professional press release using the following information:

Press Release Data: ${JSON.stringify(releaseData)}

Include:
1. Headline and subheadline
2. Opening paragraph with key announcement
3. Supporting details and quotes
4. Boilerplate about the company
5. Contact information

Tone: credible, objective, newsworthy — suitable for media outlets.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateThankYouPageCopy(thankYouData: any): Promise<string> {
    const systemPrompt = `You are an expert in customer retention and post-purchase copywriting. Write thank you page content that builds loyalty, encourages repeat business, and increases customer lifetime value.`;

    const userPrompt = `Create a high-converting thank you page copy based on this context:

Thank You Page Data: ${JSON.stringify(thankYouData)}

Include:
1. Thank you message
2. Confirmation or next steps
3. Upsell or cross-sell suggestion
4. Optional: share prompt, discount offer, or referral CTA

Tone: warm, grateful, and conversion-aware. Keep user engaged post-purchase.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.65,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }

  async generateWebsitePageCopy(pageData: any): Promise<string> {
    const systemPrompt = `You are a professional website copywriter. Craft persuasive and clear website content that communicates the offer, highlights features and benefits, and builds trust. Focus on conversion.`;

    const userPrompt = `Generate website page copy based on the following data:

Website Page Data: ${JSON.stringify(pageData)}

Output:
1. Hero section: headline, subheadline, CTA
2. Features and benefits section
3. Social proof or testimonials
4. Trust-building content (FAQs, credentials, etc.)

Make it engaging, scannable, and persuasive for online visitors.`;

    const request: DeepSeekRequest = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    };

    const response = await this.makeRequest(request);
    return response.choices[0]?.message?.content || '';
  }


}

export const deepSeekService = new DeepSeekService();