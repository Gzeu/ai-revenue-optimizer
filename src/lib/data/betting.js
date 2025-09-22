import axios from 'axios';

export async function findValueBets(matches, bookmakers) {
  try {
    const valueBets = [];
    
    for (const match of matches) {
      const odds = await getOddsComparison(match.id, bookmakers);
      const impliedProbability = calculateImpliedProbability(odds);
      const trueProbability = calculateTrueProbability(match);
      
      if (trueProbability > impliedProbability + 0.05) { // 5% edge minimum
        valueBets.push({
          match: match.teams,
          bet_type: odds.bet_type,
          bookmaker: odds.bookmaker,
          odds_value: odds.value,
          implied_probability: impliedProbability,
          true_probability: trueProbability,
          edge: trueProbability - impliedProbability,
          recommended_stake: calculateOptimalStake(trueProbability, odds.value),
          confidence: calculateConfidence(match)
        });
      }
    }
    
    return {
      total_value_bets: valueBets.length,
      value_bets: valueBets.sort((a, b) => b.edge - a.edge),
      expected_profit: calculateExpectedProfit(valueBets)
    };
  } catch (error) {
    console.error('Error finding value bets:', error);
    throw error;
  }
}

export async function findArbitrageOpportunities(matches) {
  try {
    const arbitrageOpps = [];
    
    for (const match of matches) {
      const allOdds = await getAllBookmakerOdds(match.id);
      const bestOdds = findBestOdds(allOdds);
      const arbitragePercentage = calculateArbitragePercentage(bestOdds);
      
      if (arbitragePercentage < 100) {
        arbitrageOpps.push({
          match: match.teams,
          bookmakers: bestOdds.bookmakers,
          odds: bestOdds.odds,
          arbitrage_percentage: arbitragePercentage,
          profit_margin: 100 - arbitragePercentage,
          stake_distribution: calculateStakeDistribution(bestOdds.odds, 1000),
          guaranteed_profit: (100 - arbitragePercentage) * 10 // Per 1000 RON
        });
      }
    }
    
    return {
      total_arbitrage_opportunities: arbitrageOpps.length,
      arbitrage_opportunities: arbitrageOpps.sort((a, b) => b.profit_margin - a.profit_margin),
      total_guaranteed_profit: arbitrageOpps.reduce((sum, opp) => sum + opp.guaranteed_profit, 0)
    };
  } catch (error) {
    console.error('Error finding arbitrage opportunities:', error);
    throw error;
  }
}

export function calculateBankrollStrategy(totalBankroll, riskLevel, expectedReturn) {
  const strategies = {
    conservative: {
      max_bet_percentage: 0.02,
      target_return: 0.15,
      max_risk: 0.05
    },
    moderate: {
      max_bet_percentage: 0.05,
      target_return: 0.25,
      max_risk: 0.10
    },
    aggressive: {
      max_bet_percentage: 0.10,
      target_return: 0.40,
      max_risk: 0.20
    }
  };
  
  const strategy = strategies[riskLevel] || strategies.moderate;
  
  return {
    recommended_strategy: riskLevel,
    max_bet_amount: totalBankroll * strategy.max_bet_percentage,
    daily_target: totalBankroll * (strategy.target_return / 365),
    stop_loss: totalBankroll * strategy.max_risk,
    kelly_criterion: calculateKellyCriterion(expectedReturn, 0.55), // Assuming 55% win rate
    bankroll_growth_projection: projectBankrollGrowth(totalBankroll, strategy.target_return)
  };
}

export async function analyzeRiskManagement(bettingHistory) {
  try {
    const analysis = {
      total_bets: bettingHistory.length,
      win_rate: calculateWinRate(bettingHistory),
      average_odds: calculateAverageOdds(bettingHistory),
      roi: calculateROI(bettingHistory),
      longest_winning_streak: calculateLongestStreak(bettingHistory, 'win'),
      longest_losing_streak: calculateLongestStreak(bettingHistory, 'loss'),
      profit_by_month: calculateMonthlyProfit(bettingHistory),
      risk_score: calculateRiskScore(bettingHistory)
    };
    
    return {
      performance_analysis: analysis,
      recommendations: generateRiskRecommendations(analysis),
      optimization_suggestions: generateOptimizationSuggestions(analysis)
    };
  } catch (error) {
    console.error('Error analyzing risk management:', error);
    throw error;
  }
}

// Helper functions
function calculateImpliedProbability(odds) {
  return 1 / odds;
}

function calculateTrueProbability(match) {
  // Simulate advanced statistical analysis
  return Math.random() * 0.8 + 0.1; // Between 10% and 90%
}

function calculateOptimalStake(trueProbability, odds) {
  const edge = trueProbability - (1 / odds);
  return Math.max(0, (trueProbability * odds - 1) / (odds - 1)) * 100; // Kelly Criterion percentage
}

function calculateConfidence(match) {
  // Simulate confidence calculation based on data quality
  return Math.floor(Math.random() * 40) + 60; // Between 60-100
}

function calculateArbitragePercentage(odds) {
  return (1 / odds.home + 1 / odds.draw + 1 / odds.away) * 100;
}

function calculateStakeDistribution(odds, totalStake) {
  const totalInverse = 1 / odds.home + 1 / odds.draw + 1 / odds.away;
  return {
    home: (totalStake / odds.home) / totalInverse,
    draw: (totalStake / odds.draw) / totalInverse,
    away: (totalStake / odds.away) / totalInverse
  };
}

function calculateKellyCriterion(expectedReturn, winProbability) {
  const odds = expectedReturn;
  return (winProbability * odds - (1 - winProbability)) / odds;
}

function projectBankrollGrowth(initialBankroll, annualReturn) {
  const months = 12;
  const monthlyReturn = annualReturn / months;
  const projection = [];
  
  let currentBankroll = initialBankroll;
  for (let i = 1; i <= months; i++) {
    currentBankroll = currentBankroll * (1 + monthlyReturn);
    projection.push({
      month: i,
      projected_bankroll: Math.round(currentBankroll)
    });
  }
  
  return projection;
}

function calculateWinRate(history) {
  const wins = history.filter(bet => bet.result === 'win').length;
  return (wins / history.length) * 100;
}

function calculateROI(history) {
  const totalStaked = history.reduce((sum, bet) => sum + bet.stake, 0);
  const totalReturn = history.reduce((sum, bet) => sum + (bet.result === 'win' ? bet.payout : 0), 0);
  return ((totalReturn - totalStaked) / totalStaked) * 100;
}

function generateRiskRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.win_rate < 50) {
    recommendations.push('Improve bet selection - win rate below 50%');
  }
  if (analysis.roi < 5) {
    recommendations.push('Focus on higher value bets');
  }
  
  return recommendations;
}