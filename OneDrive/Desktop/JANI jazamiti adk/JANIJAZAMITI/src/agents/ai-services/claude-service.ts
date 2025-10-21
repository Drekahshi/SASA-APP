import Anthropic from '@anthropic-ai/sdk';
import { AIResponse, AIValidationResult } from './types';
import { AIConfig } from './types';

export class ClaudeService {
  private client: Anthropic;
  private config: AIConfig['claude'];

  constructor(config: AIConfig['claude']) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey
    });
  }

  async validateTreeData(record: any): Promise<AIValidationResult> {
    const prompt = this.buildValidationPrompt(record);
    
    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const textContent = content.text;
      const parsedResult = JSON.parse(textContent);
      
      return {
        isValid: parsedResult.isValid || false,
        confidence: parsedResult.confidence || 0,
        reasoning: parsedResult.reasoning || 'No reasoning provided',
        suggestions: parsedResult.suggestions || [],
        model: 'claude'
      };
    } catch (error) {
      console.error('Claude validation error:', error);
      return {
        isValid: false,
        confidence: 0,
        reasoning: `Claude validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'claude'
      };
    }
  }

  async generateInsights(data: any[]): Promise<AIResponse> {
    const prompt = `Analyze the following tree planting data and provide insights about patterns, trends, and recommendations for improvement:\n\n${JSON.stringify(data, null, 2)}`;

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return {
        content: content.text,
        model: 'claude',
        timestamp: new Date(),
        usage: response.usage ? {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        } : undefined
      };
    } catch (error) {
      console.error('Claude insights generation error:', error);
      return {
        content: `Error generating insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: 'claude',
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
