# AI Integration for JazaMiti Validator

This document explains how to integrate and use Claude, Gemini, and OpenAI in your JazaMiti validator system.

## 🚀 Features

- **Multi-Model AI Validation**: Uses Claude, Gemini, and OpenAI for consensus-based validation
- **Intelligent Insights**: Generates comprehensive insights from multiple AI models
- **Configurable Orchestration**: Enable/disable specific AI services
- **Consensus Mechanism**: Ensures reliable validation through model agreement
- **Fallback Support**: Graceful handling when AI services are unavailable

## 📦 Installation

1. Install the required dependencies:
```bash
pnpm install
```

2. Set up your environment variables by creating a `.env` file in the root directory:
```bash
# Copy the example configuration
cp src/env.example.ts .env
```

3. Fill in your API keys in the `.env` file:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.1
OPENAI_MAX_TOKENS=1000

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.1
GEMINI_MAX_TOKENS=1000

# Anthropic Claude Configuration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_TEMPERATURE=0.1
CLAUDE_MAX_TOKENS=1000

# AI Orchestration Configuration
ENABLE_OPENAI=true
ENABLE_GEMINI=true
ENABLE_CLAUDE=true
CONSENSUS_THRESHOLD=2
FALLBACK_MODEL=openai
```

## 🔧 Configuration

### AI Service Settings

- **ENABLE_OPENAI/GEMINI/CLAUDE**: Set to `true` to enable specific AI services
- **CONSENSUS_THRESHOLD**: Minimum number of models that must agree (default: 2)
- **FALLBACK_MODEL**: Which model to use if others fail (openai/gemini/claude)

### Model Parameters

- **TEMPERATURE**: Controls randomness (0.0 = deterministic, 1.0 = very random)
- **MAX_TOKENS**: Maximum tokens in response
- **MODEL**: Specific model version to use

## 🎯 Usage

### Basic Usage

```typescript
import { JazaMitiValidator } from './agents/validator-agent/agent';

const validator = new JazaMitiValidator();

// Load your data
await validator.loadData('file', 'path/to/data.json', '');

// Run full validation with AI
await validator.runFullValidationWithAI();

// Print results
validator.printResults(true);
```

### Advanced Usage

```typescript
// Run only AI validation
await validator.validateWithAI();

// Generate AI insights
await validator.generateAIInsights();

// Get AI validation results
const aiResults = validator.getAIValidationResults();

// Get AI insights
const insights = validator.getAIInsights();
```

## 🏗️ Architecture

### AI Services Structure

```
src/agents/ai-services/
├── types.ts              # Type definitions
├── config.ts             # Configuration management
├── orchestrator.ts       # Multi-model coordination
├── openai-service.ts     # OpenAI integration
├── gemini-service.ts     # Google Gemini integration
└── claude-service.ts    # Anthropic Claude integration
```

### Key Components

1. **AIOrchestrator**: Coordinates multiple AI models for consensus validation
2. **Individual Services**: Handle specific AI provider integrations
3. **Configuration Manager**: Manages API keys and settings
4. **Consensus Engine**: Combines results from multiple models

## 🔍 How It Works

### 1. Data Validation Process

1. **Traditional Validation**: Runs existing rule-based validations
2. **AI Configuration Check**: Validates API keys and service availability
3. **Multi-Model Validation**: Each enabled AI service validates the data
4. **Consensus Calculation**: Determines final decision based on model agreement
5. **Result Integration**: Combines AI results with traditional validation

### 2. Consensus Mechanism

- **Strong Consensus**: When ≥ threshold models agree
- **Weak Consensus**: When < threshold models agree
- **Fallback**: Uses single model if others fail
- **Confidence Scoring**: Weighted average of model confidences

### 3. Insight Generation

- **Parallel Processing**: All enabled models generate insights simultaneously
- **Diverse Perspectives**: Each model provides unique analysis
- **Comprehensive Coverage**: Multiple viewpoints on data patterns

## 🛠️ API Reference

### JazaMitiValidator Methods

```typescript
// AI-powered validation
async validateWithAI(): Promise<void>
async generateAIInsights(): Promise<void>
async runFullValidationWithAI(): Promise<void>

// Get AI results
getAIValidationResults(): ConsensusResult[]
getAIInsights(): AIResponse[]
```

### AIOrchestrator Methods

```typescript
// Validation with consensus
async validateWithConsensus(record: any): Promise<ConsensusResult>

// Generate insights from all models
async generateInsightsWithConsensus(data: any[]): Promise<AIResponse[]>

// Service management
async getServiceStatus(): Promise<ServiceStatus>
validateConfiguration(): ValidationResult
```

## 🔒 Security & Best Practices

1. **API Key Management**: Store keys in environment variables, never in code
2. **Rate Limiting**: Be aware of API rate limits for each service
3. **Cost Management**: Monitor token usage and costs
4. **Error Handling**: Graceful fallbacks when services are unavailable
5. **Data Privacy**: Ensure sensitive data is handled appropriately

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**: Verify keys are correct and have proper permissions
2. **Rate Limiting**: Implement delays between requests if needed
3. **Model Availability**: Check if specific models are available in your region
4. **Configuration Errors**: Ensure all required environment variables are set

### Debug Mode

Enable verbose logging by setting:
```env
NODE_ENV=development
```

## 📊 Performance Considerations

- **Parallel Processing**: AI validations run concurrently for speed
- **Caching**: Consider caching results for repeated validations
- **Batch Processing**: Process multiple records efficiently
- **Resource Management**: Monitor memory and CPU usage

## 🔄 Future Enhancements

- **Custom Prompts**: Allow custom validation prompts per use case
- **Model Fine-tuning**: Train models on specific forestry data
- **Advanced Consensus**: Weighted voting based on model performance
- **Real-time Validation**: Stream processing for large datasets
- **Visual Analytics**: Dashboard for AI validation results

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation for each service
3. Check service status pages for outages
4. Contact support with specific error messages
