import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, AIValidationResult } from './types';
import { AIConfig } from './types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: AIConfig['gemini'];

  constructor(config: AIConfig['gemini']) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        responseMimeType: "application/json"
      }
    });
  }

  async validateTreeData(record: any): Promise<AIValidationResult> {
    const prompt = this.buildValidationPrompt(record);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response content from Gemini');
      }

      const parsedResult = JSON.parse(content);
      
      return {
        isValid: parsedResult.isValid || false,
        confidence: parsedResult.confidence || 0,
        reasoning: parsedResult.reasoning || 'No reasoning provided',
        suggestions: parsedResult.suggestions || [],
        model: 'gemini'
      };
    } catch (error) {
      console.error('Gemini validation error:', error);
      return {
        isValid: false,
        confidence: 0,
        reasoning: `Gemini validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'gemini'
      };
    }
  }

  async generateInsights(data: any[]): Promise<AIResponse> {
    const prompt = `Analyze the following tree planting data and provide insights about patterns, trends, and recommendations for improvement:\n\n${JSON.stringify(data, null, 2)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        content,
        model: 'gemini',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Gemini insights generation error:', error);
      return {
        content: `Error generating insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'gemini',
        timestamp: new Date()
      };
    }
  }

  private buildValidationPrompt(record: any): string {
    return `You are an expert in forestry data validation. Analyze the provided tree planting record and determine if it's valid. Consider factors like scientific accuracy, data completeness, and logical consistency.

Record Data:
${JSON.stringify(record, null, 2)}

Validation Criteria:
1. Scientific name accuracy (if provided)
2. Tree type validity for Kenya region
3. GPS coordinates reasonableness
4. Image quality and relevance (if provided)
5. Data completeness and consistency
6. Logical relationships between fields

Respond with a JSON object containing:
- isValid: boolean
- confidence: number (0-1)
- reasoning: string
- suggestions: string array (optional)

Please provide a detailed analysis.`;
  }
}
