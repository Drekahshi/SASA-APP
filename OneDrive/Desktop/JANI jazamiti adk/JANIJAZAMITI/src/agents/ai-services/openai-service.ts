import OpenAI from 'openai';
import { AIResponse, AIValidationResult } from './types';
import { AIConfig } from './types';

export class OpenAIService {
  private client: OpenAI;
  private config: AIConfig['openai'];

  constructor(config: AIConfig['openai']) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey
    });
  }

  async validateTreeData(record: any): Promise<AIValidationResult> {
    const prompt = this.buildValidationPrompt(record);
    
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert in forestry data validation. Analyze the provided tree planting record and determine if it's valid. Consider factors like scientific accuracy, data completeness, and logical consistency. Respond with a JSON object containing: isValid (boolean), confidence (0-1), reasoning (string), and suggestions (string array, optional).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const result = JSON.parse(content);
      
      return {
        isValid: result.isValid || false,
        confidence: result.confidence || 0,
        reasoning: result.reasoning || 'No reasoning provided',
        suggestions: result.suggestions || [],
        model: 'openai'
      };
    } catch (error) {
      console.error('OpenAI validation error:', error);
      return {
        isValid: false,
        confidence: 0,
        reasoning: `OpenAI validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'openai'
      };
    }
  }

  async generateInsights(data: any[]): Promise<AIResponse> {
    const prompt = `Analyze the following tree planting data and provide insights about patterns, trends, and recommendations for improvement:\n\n${JSON.stringify(data, null, 2)}`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a forestry data analyst. Provide detailed insights about tree planting patterns, data quality, and recommendations for improvement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage;

      return {
        content,
        model: 'openai',
        timestamp: new Date(),
        usage: usage ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens
        } : undefined
      };
    } catch (error) {
      console.error('OpenAI insights generation error:', error);
      return {
        content: `Error generating insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'openai',
        timestamp: new Date()
      };
    }
  }

  private buildValidationPrompt(record: any): string {
    return `Please validate this tree planting record:

Record Data:
${JSON.stringify(record, null, 2)}

Validation Criteria:
1. Scientific name accuracy (if provided)
2. Tree type validity for Kenya region
3. GPS coordinates reasonableness
4. Image quality and relevance (if provided)
5. Data completeness and consistency
6. Logical relationships between fields

Please provide a detailed analysis.`;
  }
}
