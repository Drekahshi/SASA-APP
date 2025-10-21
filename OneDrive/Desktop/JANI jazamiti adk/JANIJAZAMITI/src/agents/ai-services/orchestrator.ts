import { OpenAIService } from './openai-service';
import { GeminiService } from './gemini-service';
import { ClaudeService } from './claude-service';
import { AIConfigManager } from './config';
import { 
  AIValidationResult, 
  ConsensusResult, 
  AIResponse,
  AIOrchestrationConfig 
} from './types';

export class AIOrchestrator {
  private openaiService?: OpenAIService;
  private geminiService?: GeminiService;
  private claudeService?: ClaudeService;
  private config: AIOrchestrationConfig;
  private configManager: AIConfigManager;

  constructor() {
    this.configManager = new AIConfigManager();
    this.config = this.configManager.getOrchestrationConfig();
    this.initializeServices();
  }

  private initializeServices(): void {
    const aiConfig = this.configManager.getConfig();

    if (this.config.enableOpenAI && aiConfig.openai.apiKey) {
      this.openaiService = new OpenAIService(aiConfig.openai);
    }

    if (this.config.enableGemini && aiConfig.gemini.apiKey) {
      this.geminiService = new GeminiService(aiConfig.gemini);
    }

    if (this.config.enableClaude && aiConfig.claude.apiKey) {
      this.claudeService = new ClaudeService(aiConfig.claude);
    }
  }

  async validateWithConsensus(record: any): Promise<ConsensusResult> {
    const results: AIValidationResult[] = [];
    const promises: Promise<AIValidationResult>[] = [];

    // Run validation on all enabled services in parallel
    if (this.openaiService) {
      promises.push(this.openaiService.validateTreeData(record));
    }

    if (this.geminiService) {
      promises.push(this.geminiService.validateTreeData(record));
    }

    if (this.claudeService) {
      promises.push(this.claudeService.validateTreeData(record));
    }

    try {
      const validationResults = await Promise.allSettled(promises);
      
      validationResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`AI service ${index} failed:`, result.reason);
        }
      });

      return this.calculateConsensus(results);
    } catch (error) {
      console.error('Error in consensus validation:', error);
      return this.createFallbackResult(error);
    }
  }

  async generateInsightsWithConsensus(data: any[]): Promise<AIResponse[]> {
    const responses: AIResponse[] = [];
    const promises: Promise<AIResponse>[] = [];

    // Generate insights from all enabled services in parallel
    if (this.openaiService) {
      promises.push(this.openaiService.generateInsights(data));
    }

    if (this.geminiService) {
      promises.push(this.geminiService.generateInsights(data));
    }

    if (this.claudeService) {
      promises.push(this.claudeService.generateInsights(data));
    }

    try {
      const insightResults = await Promise.allSettled(promises);
      
      insightResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          responses.push(result.value);
        } else {
          console.error(`AI service ${index} failed:`, result.reason);
        }
      });

      return responses;
    } catch (error) {
      console.error('Error in consensus insights generation:', error);
      return [];
    }
  }

  private calculateConsensus(results: AIValidationResult[]): ConsensusResult {
    if (results.length === 0) {
      return {
        finalDecision: false,
        confidence: 0,
        individualResults: [],
        consensusReached: false,
        reasoning: 'No AI services available for validation'
      };
    }

    const validResults = results.filter(r => r.isValid);
    const invalidResults = results.filter(r => !r.isValid);
    
    const consensusReached = validResults.length >= this.config.consensusThreshold || 
                           invalidResults.length >= this.config.consensusThreshold;

    const finalDecision = validResults.length > invalidResults.length;
    
    // Calculate weighted confidence based on individual confidences
    const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);
    const averageConfidence = totalConfidence / results.length;

    // Generate consensus reasoning
    const reasoning = this.generateConsensusReasoning(results, finalDecision, consensusReached);

    return {
      finalDecision,
      confidence: averageConfidence,
      individualResults: results,
      consensusReached,
      reasoning
    };
  }

  private generateConsensusReasoning(
    results: AIValidationResult[], 
    finalDecision: boolean, 
    consensusReached: boolean
  ): string {
    const validCount = results.filter(r => r.isValid).length;
    const totalCount = results.length;
    
    let reasoning = `Consensus Analysis: ${validCount}/${totalCount} models agree the record is ${finalDecision ? 'valid' : 'invalid'}. `;
    
    if (consensusReached) {
      reasoning += `Strong consensus reached. `;
    } else {
      reasoning += `Weak consensus - consider manual review. `;
    }

    reasoning += `Individual model reasoning: `;
    results.forEach((result, index) => {
      reasoning += `${result.model} (${result.confidence.toFixed(2)} confidence): ${result.reasoning.substring(0, 100)}... `;
    });

    return reasoning;
  }

  private createFallbackResult(error: any): ConsensusResult {
    return {
      finalDecision: false,
      confidence: 0,
      individualResults: [],
      consensusReached: false,
      reasoning: `All AI services failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }

  async getServiceStatus(): Promise<{
    openai: boolean;
    gemini: boolean;
    claude: boolean;
    totalEnabled: number;
  }> {
    return {
      openai: !!this.openaiService,
      gemini: !!this.geminiService,
      claude: !!this.claudeService,
      totalEnabled: [this.openaiService, this.geminiService, this.claudeService].filter(Boolean).length
    };
  }

  validateConfiguration(): { isValid: boolean; errors: string[] } {
    return this.configManager.validateConfig();
  }
}
