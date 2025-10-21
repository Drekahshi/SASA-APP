// Environment Configuration Example
// Copy this file to .env and fill in your API keys

export const ENV_EXAMPLE = {
  // OpenAI Configuration
  OPENAI_API_KEY: 'your_openai_api_key_here',
  OPENAI_MODEL: 'gpt-4o',
  OPENAI_TEMPERATURE: '0.1',
  OPENAI_MAX_TOKENS: '1000',

  // Google Gemini Configuration
  GEMINI_API_KEY: 'your_gemini_api_key_here',
  GEMINI_MODEL: 'gemini-1.5-pro',
  GEMINI_TEMPERATURE: '0.1',
  GEMINI_MAX_TOKENS: '1000',

  // Anthropic Claude Configuration
  CLAUDE_API_KEY: 'your_claude_api_key_here',
  CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',
  CLAUDE_TEMPERATURE: '0.1',
  CLAUDE_MAX_TOKENS: '1000',

  // AI Orchestration Configuration
  ENABLE_OPENAI: 'true',
  ENABLE_GEMINI: 'true',
  ENABLE_CLAUDE: 'true',
  CONSENSUS_THRESHOLD: '2',
  FALLBACK_MODEL: 'openai',

  // Other Configuration
  NODE_ENV: 'development'
};

// Instructions:
// 1. Create a .env file in the root directory
// 2. Copy the values above and replace with your actual API keys
// 3. Make sure to add .env to your .gitignore file
