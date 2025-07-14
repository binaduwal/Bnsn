import axios from 'axios';
import { DeepSeekRequest, DeepSeekResponse } from '../types';
import { createError } from '../middleware/errorHandler';

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
        `${this.baseURL}/v1/chat/completions`,
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

  async generateBlueprint(feedBnsn: string, offerType: string): Promise<string> {
    const systemPrompt = `You are an expert business strategist and copywriter specializing in creating detailed business blueprints. 
    Your task is to analyze the provided business information and generate a comprehensive blueprint that includes:
    1. Project analysis and strategy
    2. Target audience identification
    3. Content creation suggestions
    4. Marketing approach recommendations
    5. Implementation roadmap

    Provide a structured, actionable blueprint that can be immediately implemented.`;

    const userPrompt = `Create a comprehensive business blueprint for:
    Business Description: ${feedBnsn}
    Offer Type: ${offerType}
    
    Please provide a detailed blueprint with specific actionable steps.`;

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
    return response.choices[0]?.message?.content || '';
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
}

export const deepSeekService = new DeepSeekService();