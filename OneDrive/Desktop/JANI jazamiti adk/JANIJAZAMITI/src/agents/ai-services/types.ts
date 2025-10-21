// AI Service Types and Interfaces
export interface AIResponse {
  content: string;
  confidence?: number;
  model: string;
  timestamp: Date;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIValidationResult {
  isValid: boolean;
  confidence: number;
  reasoning: string;
  suggestions?: string[];
  model: string;
}

export interface AIConfig {
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  gemini: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  claude: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface AIOrchestrationConfig {
  enableOpenAI: boolean;
  enableGemini: boolean;
  enableClaude: boolean;
  consensusThreshold: number; // Minimum number of models that must agree
  fallbackModel: 'openai' | 'gemini' | 'claude';
}

export interface ConsensusResult {
  finalDecision: boolean;
  confidence: number;
  individualResults: AIValidationResult[];
  consensusReached: boolean;
  reasoning: string;
}
