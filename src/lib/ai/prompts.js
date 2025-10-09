/**
 * AI Analysis Prompts for different platforms
 * Specialized prompts for analyzing profit opportunities across various platforms
 */

export const ANALYSIS_PROMPTS = {
    crypto: `
Analyze the following cryptocurrency data and identify profit opportunities:

{DATA}

Provide analysis focusing on:
1. Arbitrage opportunities with specific exchanges and price differences
2. DeFi yield farming with APY estimates and risk assessment
3. Staking rewards and optimal allocation strategies
4. Market inefficiencies and timing recommendations
5. Risk management and position sizing

Format response with clear opportunities, risks, and actionable recommendations.
    `,

    github: `
Analyze the following GitHub repository data for monetization opportunities:

{DATA}

Provide analysis focusing on:
1. GitHub Sponsors potential with revenue estimates
2. Premium features and SaaS opportunities
3. Marketplace opportunities (Actions, Extensions, Packages)
4. Licensing and enterprise deals
5. Community building and engagement strategies

Format response with specific monetization strategies, timeline, and revenue projections.
    `,

    kdp: `
Analyze the following Kindle Direct Publishing data for optimization opportunities:

{DATA}

Provide analysis focusing on:
1. Keyword optimization for better rankings
2. Pricing strategies and elasticity analysis
3. Category positioning and competition gaps
4. Content expansion opportunities
5. Marketing and promotional strategies

Format response with specific optimization tactics, expected impact, and implementation timeline.
    `,

    betting: `
Analyze the following betting/trading data for value opportunities:

{DATA}

Provide analysis focusing on:
1. Value betting opportunities with positive expected value
2. Arbitrage betting across different bookmakers
3. Bankroll optimization and Kelly criterion application
4. Market inefficiencies and timing strategies
5. Risk management and diversification

Format response with specific betting strategies, stake recommendations, and risk assessment.
    `,

    comprehensive: `
Analyze the following multi-platform data to identify the highest-value profit opportunities:

{DATA}

Provide comprehensive analysis focusing on:
1. Cross-platform synergies and compound opportunities
2. Resource allocation optimization across platforms
3. Timeline coordination for maximum impact
4. Risk diversification strategies
5. ROI prioritization matrix

Format response with prioritized action plan, resource requirements, and expected outcomes.
    `
};

export const SYSTEM_PROMPTS = {
    cryptoAnalyst: 'You are an expert cryptocurrency analyst and trader with deep knowledge of DeFi, arbitrage, and market dynamics. Your analysis focuses on identifying profitable opportunities while managing risk effectively.',
    
    githubMonetization: 'You are an expert in open-source monetization and GitHub ecosystem. You understand sponsorship models, SaaS transitions, marketplace opportunities, and community building strategies.',
    
    kdpOptimizer: 'You are an expert in Kindle Direct Publishing optimization and book marketing. You understand Amazon\'s algorithm, keyword research, pricing strategies, and content marketing.',
    
    bettingAnalyst: 'You are an expert in sports betting analytics and value betting strategies. You understand probability theory, bankroll management, and market inefficiency detection.',
    
    businessConsultant: 'You are a strategic business consultant specializing in revenue optimization and multi-platform growth strategies. You create actionable, time-bound plans that maximize revenue while minimizing risk.'
};

export const AUTOMATION_PROMPTS = {
    generateActions: `
Based on the following opportunity analysis, generate specific automation actions:

{ANALYSIS}

For each high-priority opportunity, provide:
1. Automated action steps (what can be done programmatically)
2. Manual intervention points (where human input is needed)
3. Success metrics and monitoring requirements
4. Rollback procedures if needed
5. Integration requirements with external APIs

Format as executable automation workflow.
    `,
    
    riskAssessment: `
Evaluate the following opportunities for automation safety:

{OPPORTUNITIES}

For each opportunity, assess:
1. Automation risk level (Low/Medium/High)
2. Maximum safe investment amount
3. Stop-loss conditions
4. Monitoring requirements
5. Human approval checkpoints

Provide risk-adjusted automation recommendations.
    `,
    
    performanceReview: `
Analyze the following performance data from automated opportunities:

{PERFORMANCE_DATA}

Provide analysis on:
1. ROI vs. projections
2. Risk-adjusted returns
3. Opportunity accuracy (prediction vs. actual)
4. Improvement recommendations
5. Strategy refinements

Format as performance report with actionable insights.
    `
};

export const NOTIFICATION_TEMPLATES = {
    highValue: {
        title: '🚀 High-Value Opportunity Detected',
        message: 'A high-confidence opportunity worth ${VALUE} has been identified on {PLATFORM}. Review and action recommended within {TIMEFRAME}.'
    },
    
    timeExpiring: {
        title: '⏰ Opportunity Expiring Soon',
        message: 'The {OPPORTUNITY_TYPE} opportunity on {PLATFORM} expires in {TIME_REMAINING}. Immediate action required.'
    },
    
    riskAlert: {
        title: '⚠️ Risk Alert',
        message: 'High-risk conditions detected for {OPPORTUNITY_TYPE}. Review risk parameters and consider position adjustment.'
    },
    
    success: {
        title: '✅ Opportunity Completed',
        message: 'Successfully executed {OPPORTUNITY_TYPE} with {ACTUAL_PROFIT} profit. ROI: {ROI_PERCENTAGE}%.'
    }
};