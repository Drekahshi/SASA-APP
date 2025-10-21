// AI Integration Example
// This demonstrates how to use the AI-powered JazaMiti validator

import { JazaMitiValidator } from './agents/validator-agent/agent';
import * as path from 'path';

// Sample tree planting data
const sampleData = [
  {
    id: "tree_001",
    name: "Acacia Tortilis",
    scientificName: "Vachellia tortilis",
    typePlanted: "indigenous",
    region: "Kajiado",
    count: 50,
    gpsData: {
      latitude: -1.2921,
      longitude: 36.8219,
      accuracy: 5
    },
    images: ["tree_001_image.jpg"],
    imageVerification: {
      verified: true,
      timestamp: "2024-01-15T10:30:00Z"
    }
  },
  {
    id: "tree_002", 
    name: "Baobab",
    scientificName: "Adansonia digitata",
    typePlanted: "indigenous",
    region: "Kilifi",
    count: 25,
    gpsData: {
      latitude: -3.5107,
      longitude: 39.9093,
      accuracy: 3
    },
    images: ["tree_002_image.jpg"],
    imageVerification: {
      verified: false,
      timestamp: "2024-01-15T11:00:00Z"
    }
  }
];

async function demonstrateAIIntegration() {
  console.log('🌳 JazaMiti AI Integration Demo');
  console.log('================================\n');

  try {
    // Create validator instance
    const validator = new JazaMitiValidator();
    
    // Create a temporary data file
    const dataFilePath = path.resolve(__dirname, 'temp_sample_data.json');
    const fs = require('fs');
    fs.writeFileSync(dataFilePath, JSON.stringify(sampleData, null, 2));
    
    console.log('📂 Loading sample data...');
    await validator.loadData('file', dataFilePath, '');
    
    console.log('🤖 Running AI-powered validation...\n');
    
    // Run full validation with AI
    await validator.runFullValidationWithAI();
    
    // Print results
    validator.printResults(true);
    
    // Show AI insights
    const aiInsights = validator.getAIInsights();
    if (aiInsights.length > 0) {
      console.log('\n🧠 AI INSIGHTS');
      console.log('==============');
      aiInsights.forEach((insight, index) => {
        console.log(`\n📊 Model ${index + 1} (${insight.model}):`);
        console.log(insight.content);
        console.log(`Generated: ${insight.timestamp.toISOString()}`);
        if (insight.usage) {
          console.log(`Tokens used: ${insight.usage.totalTokens}`);
        }
      });
    }
    
    // Show AI validation results
    const aiResults = validator.getAIValidationResults();
    if (aiResults.length > 0) {
      console.log('\n🎯 AI VALIDATION RESULTS');
      console.log('========================');
      aiResults.forEach((result, index) => {
        console.log(`\nRecord ${index + 1}:`);
        console.log(`Decision: ${result.finalDecision ? '✅ VALID' : '❌ INVALID'}`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`Consensus: ${result.consensusReached ? 'Strong' : 'Weak'}`);
        console.log(`Reasoning: ${result.reasoning}`);
      });
    }
    
    // Clean up
    fs.unlinkSync(dataFilePath);
    
    console.log('\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  demonstrateAIIntegration().catch(console.error);
}

export { demonstrateAIIntegration };
