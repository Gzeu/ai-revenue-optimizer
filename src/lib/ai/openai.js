import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '$env/static/private';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID
});

/**
 * Analyze profit opportunities using GPT-4
 * @param {Object} data - Data to analyze
 * @param {string} type - Type of analysis (crypto, github, kdp, betting)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeOpportunities(data, type) {
  try {
    const systemPrompt = getSystemPrompt(type);
    const userPrompt = formatDataForAnalysis(data, type);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    return parseAnalysisResponse(completion.choices[0].message.content, type);
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze opportunities');
  }
}

/**
 * Generate automation suggestions
 * @param {Object} opportunities - Identified opportunities
 * @param {string} type - Type of automation
 * @returns {Promise<Object>} Automation suggestions
 */
export async function generateAutomationSuggestions(opportunities, type) {
  try {
    const prompt = `
Based on these profit opportunities, suggest specific automation strategies:
${JSON.stringify(opportunities, null, 2)}

Provide:
1. Immediate actions to take
2. Automation workflows
3. Risk assessment
4. Expected ROI
5. Implementation priority

Respond in JSON format.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Automation suggestion error:', error);
    throw new Error('Failed to generate automation suggestions');
  }
}

/**
 * Get system prompt based on analysis type
 */
function getSystemPrompt(type) {
  const prompts = {
    crypto: `You are a cryptocurrency profit optimization expert. Analyze trading data, market trends, and identify profit opportunities. Focus on:
- Arbitrage opportunities
- DeFi yield farming
- Staking rewards
- Market inefficiencies
- Risk-adjusted returns`,
    
    github: `You are a GitHub monetization expert. Analyze repository data and identify revenue opportunities. Focus on:
- Sponsorship potential
- Premium features
- Marketplace listings
- Consulting opportunities
- Open source commercialization`,
    
    kdp: `You are a Kindle Direct Publishing optimization expert. Analyze book performance and market data. Focus on:
- Keyword optimization
- Pricing strategies
- Category positioning
- Content gaps
- Marketing opportunities`,
    
    betting: `You are a sports betting analytics expert. Analyze odds and market data for value bets. Focus on:
- Value betting opportunities
- Arbitrage bets
- Market inefficiencies
- Risk management
- Bankroll optimization`
  };
  
  return prompts[type] || 'You are a general profit optimization expert.';
}

/**
 * Format data for AI analysis
 */
function formatDataForAnalysis(data, type) {
  return `Analyze this ${type} data for profit opportunities:\n\n${JSON.stringify(data, null, 2)}\n\nProvide specific, actionable insights with expected profit potential.`;
}

/**
 * Parse AI response into structured format
 */
function parseAnalysisResponse(response, type) {
  try {
    // Try to parse as JSON first
    return JSON.parse(response);
  } catch {
    // Fallback to structured text parsing
    return {
      type,
      analysis: response,
      opportunities: extractOpportunities(response),
      recommendations: extractRecommendations(response),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Extract opportunities from text response
 */
function extractOpportunities(text) {
  const opportunities = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.toLowerCase().includes('opportunity') || line.toLowerCase().includes('profit')) {
      opportunities.push(line.trim());
    }
  });
  
  return opportunities;
}

/**
 * Extract recommendations from text response
 */
function extractRecommendations(text) {
  const recommendations = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('suggest')) {
      recommendations.push(line.trim());
    }
  });
  
  return recommendations;
}
