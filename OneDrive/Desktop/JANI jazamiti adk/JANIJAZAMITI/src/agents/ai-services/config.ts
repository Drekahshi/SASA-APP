import { AIConfig, AIOrchestrationConfig } from './types';

export class AIConfigManager {
  private config: AIConfig;
  private orchestrationConfig: AIOrchestrationConfig;

  constructor() {
    this.config = this.loadConfig();
    this.orchestrationConfig = this.loadOrchestrationConfig();
  }

  private loadConfig(): AIConfig {
    return {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.1'),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000')
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.1'),
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '1000')
      },
      claude: {
        apiKey: process.env.CLAUDE_API_KEY || '',
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.1'),
        maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '1000')
      }
    };
  }

  private loadOrchestrationConfig(): AIOrchestrationConfig {
    return {
      enableOpenAI: process.env.ENABLE_OPENAI === 'true',
      enableGemini: process.env.ENABLE_GEMINI === 'true',
      enableClaude: process.env.ENABLE_CLAUDE === 'true',
      consensusThreshold: parseInt(process.env.CONSENSUS_THRESHOLD || '2'),
      fallbackModel: (process.env.FALLBACK_MODEL as 'openai' | 'gemini' | 'claude') || 'openai'
    };
  }

  getConfig(): AIConfig {
    return this.config;
  }

  getOrchestrationConfig(): AIOrchestrationConfig {
    return this.orchestrationConfig;
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.orchestrationConfig.enableOpenAI && !this.config.openai.apiKey) {
      errors.push('OpenAI API key is required when OpenAI is enabled');
    }

    if (this.orchestrationConfig.enableGemini && !this.config.gemini.apiKey) {
      errors.push('Gemini API key is required when Gemini is enabled');
    }

    if (this.orchestrationConfig.enableClaude && !this.config.claude.apiKey) {
      errors.push('Claude API key is required when Claude is enabled');
    }

    const enabledServices = [
      this.orchestrationConfig.enableOpenAI,
      this.orchestrationConfig.enableGemini,
      this.orchestrationConfig.enableClaude
    ].filter(Boolean).length;

    if (enabledServices === 0) {
      errors.push('At least one AI service must be enabled');
    }

    if (this.orchestrationConfig.consensusThreshold > enabledServices) {
      errors.push('Consensus threshold cannot be greater than the number of enabled services');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
