// src/agent/validator.ts
import axios from 'axios';
import * as fs from 'fs';
import { JazaMitiRecord, TestResult } from '../agent';
import {
  isValidKenyaRegion,
  isValidTreeType,
  isValidScientificName,
  isValidImage
} from './tools';
import { AIOrchestrator } from '../ai-services/orchestrator';
import { ConsensusResult, AIResponse } from '../ai-services/types';

export class JazaMitiValidator {
  private data: JazaMitiRecord[] = [];
  private testResults: TestResult[] = [];
  private aiOrchestrator: AIOrchestrator;
  private aiValidationResults: ConsensusResult[] = [];
  private aiInsights: AIResponse[] = [];

  constructor() {
    this.aiOrchestrator = new AIOrchestrator();
  }

  async loadData(source: string, filePath: string, serverUrl: string): Promise<void> {
    try {
      if (source === 'file') {
        console.log(`📂 Loading data from file: ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.testResults.push({
          name: 'Load mock data from file',
          status: 'PASS',
          message: `Loaded ${this.data.length} records`
        });
      } else {
        console.log(`📥 Fetching data from server: ${serverUrl}`);
        const response = await axios.get(serverUrl);
        this.data = response.data;
        this.testResults.push({
          name: 'Fetch data from GOK server',
          status: 'PASS',
          message: `Fetched ${this.data.length} records`
        });
      }
    } catch (error) {
      this.testResults.push({
        name: `Load data from ${source}`,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  validateStructure(): void {
    const errors: string[] = [];

    if (!Array.isArray(this.data)) {
      errors.push('Data is not an array');
      this.testResults.push({
        name: 'Validate data structure',
        status: 'FAIL',
        message: 'Data is not an array'
      });
      return;
    }

    if (this.data.length === 0) {
      errors.push('Data array is empty');
      this.testResults.push({
        name: 'Validate data structure',
        status: 'FAIL',
        message: 'Data array is empty'
      });
      return;
    }

    this.data.forEach((record, index) => {
      if (!record.id) errors.push(`Record ${index}: Missing 'id'`);
      if (!record.name) errors.push(`Record ${index}: Missing 'name'`);
      if (record.id && typeof record.id !== 'string') errors.push(`Record ${index}: 'id' must be string`);
      if (record.name && typeof record.name !== 'string') errors.push(`Record ${index}: 'name' must be string`);
    });

    this.testResults.push({
      name: 'Validate data structure',
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      message: errors.length === 0 ? 'All records have required fields' : errors.join('; ')
    });
  }

  validateDataQuality(): void {
    const warnings: string[] = [];

    this.data.forEach((record, index) => {
      if (record.name && record.name.trim() === '') {
        warnings.push(`Record ${index}: 'name' is empty`);
      }
      if (record.count !== undefined && record.count < 0) {
        warnings.push(`Record ${index}: 'count' is negative`);
      }
    });

    this.testResults.push({
      name: 'Validate data quality',
      status: warnings.length === 0 ? 'PASS' : 'FAIL',
      message: warnings.length === 0 ? 'Data quality checks passed' : warnings.join('; ')
    });
  }

  validateBusinessRules(): void {
    const errors: string[] = [];

    this.data.forEach((record, index) => {
      if (record.region && !isValidKenyaRegion(record.region)) {
        errors.push(`Record ${index}: Invalid region '${record.region}'`);
      }
      if (record.typePlanted && !isValidTreeType(record.typePlanted)) {
        errors.push(`Record ${index}: Invalid tree type '${record.typePlanted}'`);
      }
      if (record.scientificName && !isValidScientificName(record.scientificName)) {
        errors.push(`Record ${index}: Invalid scientific name format`);
      }
    });

    this.testResults.push({
      name: 'Validate business rules',
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      message: errors.length === 0 ? 'All business rules satisfied' : errors.join('; ')
    });
  }

  validateGpsData(): void {
    const errors: string[] = [];

    this.data.forEach((record, index) => {
      if (!record.gpsData) {
        errors.push(`Record ${index}: GPS data missing`);
        return;
      }

      const gps = record.gpsData;
      if (typeof gps.latitude !== 'number') errors.push(`Record ${index}: Invalid latitude`);
      if (typeof gps.longitude !== 'number') errors.push(`Record ${index}: Invalid longitude`);
      if (gps.latitude < -90 || gps.latitude > 90) errors.push(`Record ${index}: Latitude out of range`);
      if (gps.longitude < -180 || gps.longitude > 180) errors.push(`Record ${index}: Longitude out of range`);

      // Check Kenya bounds
      const kenyaBounds = { minLat: -4.67677, maxLat: 4.89973, minLon: 29.0, maxLon: 41.9 };
      if (gps.latitude < kenyaBounds.minLat || gps.latitude > kenyaBounds.maxLat ||
          gps.longitude < kenyaBounds.minLon || gps.longitude > kenyaBounds.maxLon) {
        errors.push(`Record ${index}: Coordinates outside Kenya bounds`);
      }
    });

    this.testResults.push({
      name: 'Validate GPS data',
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      message: errors.length === 0 ? 'All GPS coordinates valid' : errors.join('; ')
    });
  }

  validateImageData(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.data.forEach((record, index) => {
      if (!record.images) {
        warnings.push(`Record ${index}: No images provided`);
        return;
      }

      if (!Array.isArray(record.images)) {
        errors.push(`Record ${index}: 'images' must be array`);
        return;
      }

      if (record.images.length === 0) {
        warnings.push(`Record ${index}: Empty images array`);
      }

      record.images.forEach((img, imgIndex) => {
        if (typeof img !== 'string') {
          errors.push(`Record ${index}, Image ${imgIndex}: Must be string`);
          return;
        }
        if (!isValidImage(img)) {
          errors.push(`Record ${index}, Image ${imgIndex}: Invalid format`);
        }
      });
    });

    this.testResults.push({
      name: 'Validate image data',
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      message: errors.length === 0 ? 'All images valid' : errors.join('; ')
    });
  }

  getTestResults(): TestResult[] {
    return this.testResults;
  }

  getData(): JazaMitiRecord[] {
    return this.data;
  }

  printResults(verbose: boolean): void {
    console.log('='.repeat(60));
    console.log('TEST RESULTS');
    console.log('='.repeat(60) + '\n');

    this.testResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✓' : '✗';
      console.log(`${icon} ${result.name}`);
      if (verbose || result.status === 'FAIL') {
        console.log(`  └─ ${result.message}`);
      }
      console.log();
    });

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const total = this.testResults.length;

    console.log('='.repeat(60));
    console.log(`Summary: ${passed}/${total} tests passed`);
    console.log(`Status: ${passed === total ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('='.repeat(60) + '\n');

    if (passed !== total) {
      process.exit(1);
    }
  }

  // AI-Powered Validation Methods
  async validateWithAI(): Promise<void> {
    console.log('🤖 Starting AI-powered validation...');
    
    try {
      // Validate configuration first
      const configValidation = this.aiOrchestrator.validateConfiguration();
      if (!configValidation.isValid) {
        this.testResults.push({
          name: 'AI Configuration Validation',
          status: 'FAIL',
          message: `Configuration errors: ${configValidation.errors.join(', ')}`
        });
        return;
      }

      // Get service status
      const serviceStatus = await this.aiOrchestrator.getServiceStatus();
      this.testResults.push({
        name: 'AI Services Status',
        status: 'PASS',
        message: `Enabled services: OpenAI(${serviceStatus.openai}), Gemini(${serviceStatus.gemini}), Claude(${serviceStatus.claude})`
      });

      // Validate each record with AI consensus
      for (let i = 0; i < this.data.length; i++) {
        const record = this.data[i];
        console.log(`🤖 Validating record ${i + 1}/${this.data.length} with AI...`);
        
        const consensusResult = await this.aiOrchestrator.validateWithConsensus(record);
        this.aiValidationResults.push(consensusResult);

        this.testResults.push({
          name: `AI Validation - Record ${i + 1}`,
          status: consensusResult.finalDecision ? 'PASS' : 'FAIL',
          message: `Consensus: ${consensusResult.consensusReached ? 'Strong' : 'Weak'} (${consensusResult.confidence.toFixed(2)} confidence) - ${consensusResult.reasoning.substring(0, 100)}...`
        });
      }

      console.log('✅ AI validation completed');
    } catch (error) {
      this.testResults.push({
        name: 'AI Validation',
        status: 'FAIL',
        message: `AI validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  async generateAIInsights(): Promise<void> {
    console.log('🧠 Generating AI insights...');
    
    try {
      const insights = await this.aiOrchestrator.generateInsightsWithConsensus(this.data);
      this.aiInsights = insights;

      this.testResults.push({
        name: 'AI Insights Generation',
        status: 'PASS',
        message: `Generated insights from ${insights.length} AI models`
      });

      // Print insights from each model
      insights.forEach((insight, index) => {
        console.log(`\n📊 Insights from ${insight.model}:`);
        console.log(insight.content);
        console.log(`Generated at: ${insight.timestamp.toISOString()}`);
        if (insight.usage) {
          console.log(`Token usage: ${insight.usage.totalTokens} tokens`);
        }
      });

    } catch (error) {
      this.testResults.push({
        name: 'AI Insights Generation',
        status: 'FAIL',
        message: `AI insights generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  getAIValidationResults(): ConsensusResult[] {
    return this.aiValidationResults;
  }

  getAIInsights(): AIResponse[] {
    return this.aiInsights;
  }

  async runFullValidationWithAI(): Promise<void> {
    console.log('🚀 Running full validation with AI integration...\n');
    
    // Run traditional validations
    this.validateStructure();
    this.validateDataQuality();
    this.validateBusinessRules();
    this.validateGpsData();
    this.validateImageData();
    
    // Run AI-powered validations
    await this.validateWithAI();
    await this.generateAIInsights();
    
    console.log('\n🎯 Full validation with AI completed!');
  }
}