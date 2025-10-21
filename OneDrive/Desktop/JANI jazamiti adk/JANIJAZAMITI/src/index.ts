import { JazaMitiValidator } from './agents/validator-agent/agent';
import * as path from 'path';

// Sample data is in this file, so we'll use it as the source
const dataFilePath = path.resolve(__dirname, 'index.ts');

async function main() {
  try {
    // Create a new validator instance
    const validator = new JazaMitiValidator();
    
    // Load data from the file
    await validator.loadData('file', dataFilePath, '');
    
    // Run full validation with AI integration
    await validator.runFullValidationWithAI();
    
    // Print the results (with verbose output)
    validator.printResults(true);
    
    // Print AI insights summary
    const aiInsights = validator.getAIInsights();
    if (aiInsights.length > 0) {
      console.log('\n🤖 AI INSIGHTS SUMMARY');
      console.log('='.repeat(60));
      aiInsights.forEach((insight, index) => {
        console.log(`\n📊 Model ${index + 1} (${insight.model}):`);
        console.log(insight.content.substring(0, 200) + '...');
      });
    }
    
  } catch (error) {
    console.error('Error running validator:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);