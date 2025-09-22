import axios from 'axios';

export async function analyzeKeywords(title, description, keywords) {
  try {
    // Simulate keyword analysis
    const keywordData = {
      primary_keywords: extractPrimaryKeywords(title),
      secondary_keywords: extractSecondaryKeywords(description),
      keyword_density: calculateKeywordDensity(title + ' ' + description, keywords),
      suggestions: generateKeywordSuggestions(title),
      competition_score: calculateCompetitionScore(keywords)
    };
    
    return keywordData;
  } catch (error) {
    console.error('Error analyzing keywords:', error);
    throw error;
  }
}

export async function analyzePricing(category, pageCount, competition) {
  try {
    const basePrice = calculateBasePrice(category, pageCount);
    const competitivePrice = adjustForCompetition(basePrice, competition);
    
    return {
      recommended_price: competitivePrice,
      price_range: {
        min: competitivePrice * 0.8,
        max: competitivePrice * 1.2
      },
      profit_margin: calculateProfitMargin(competitivePrice),
      pricing_strategy: determinePricingStrategy(competition)
    };
  } catch (error) {
    console.error('Error analyzing pricing:', error);
    throw error;
  }
}

export async function findContentGaps(category, niche) {
  try {
    // Simulate content gap analysis
    const gaps = [
      {
        topic: `Advanced ${niche} Techniques`,
        demand_score: 85,
        competition_score: 30,
        profit_potential: 'high'
      },
      {
        topic: `${niche} for Beginners`,
        demand_score: 95,
        competition_score: 70,
        profit_potential: 'medium'
      },
      {
        topic: `${niche} Case Studies`,
        demand_score: 60,
        competition_score: 20,
        profit_potential: 'high'
      }
    ];
    
    return {
      total_gaps: gaps.length,
      content_gaps: gaps,
      top_opportunity: gaps.sort((a, b) => 
        (b.demand_score - b.competition_score) - (a.demand_score - a.competition_score)
      )[0]
    };
  } catch (error) {
    console.error('Error finding content gaps:', error);
    throw error;
  }
}

export async function optimizeCategories(bookData) {
  try {
    const categories = [
      { name: 'Business & Money', relevance: 85, competition: 'high' },
      { name: 'Self-Help', relevance: 75, competition: 'medium' },
      { name: 'Education & Teaching', relevance: 90, competition: 'low' }
    ];
    
    return {
      current_category: bookData.category,
      recommended_categories: categories
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3),
      category_optimization_score: calculateCategoryScore(bookData.category)
    };
  } catch (error) {
    console.error('Error optimizing categories:', error);
    throw error;
  }
}

// Helper functions
function extractPrimaryKeywords(title) {
  return title.toLowerCase().split(' ')
    .filter(word => word.length > 3)
    .slice(0, 5);
}

function extractSecondaryKeywords(description) {
  return description.toLowerCase().split(' ')
    .filter(word => word.length > 4)
    .slice(0, 10);
}

function calculateKeywordDensity(text, keywords) {
  const words = text.toLowerCase().split(' ');
  const keywordCount = keywords.filter(keyword => 
    words.includes(keyword.toLowerCase())
  ).length;
  return (keywordCount / words.length) * 100;
}

function generateKeywordSuggestions(title) {
  // Simulate AI-generated keyword suggestions
  return [
    `${title} guide`,
    `${title} handbook`,
    `${title} secrets`,
    `${title} mastery`
  ];
}

function calculateCompetitionScore(keywords) {
  // Simulate competition analysis
  return Math.floor(Math.random() * 100);
}

function calculateBasePrice(category, pageCount) {
  const categoryMultipliers = {
    'business': 1.5,
    'self-help': 1.2,
    'fiction': 1.0,
    'coloring': 0.8
  };
  
  const basePrice = (pageCount / 100) * 10;
  const multiplier = categoryMultipliers[category.toLowerCase()] || 1.0;
  
  return basePrice * multiplier;
}

function adjustForCompetition(basePrice, competition) {
  const competitionAdjustments = {
    'low': 1.2,
    'medium': 1.0,
    'high': 0.8
  };
  
  return basePrice * (competitionAdjustments[competition] || 1.0);
}

function calculateProfitMargin(price) {
  const costs = 2.50; // Printing and Amazon fees
  return ((price - costs) / price) * 100;
}

function determinePricingStrategy(competition) {
  if (competition === 'low') return 'premium';
  if (competition === 'high') return 'competitive';
  return 'balanced';
}

function calculateCategoryScore(category) {
  // Simulate category optimization score
  return Math.floor(Math.random() * 100);
}