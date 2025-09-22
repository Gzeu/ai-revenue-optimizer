import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices(coinIds = ['bitcoin', 'ethereum']) {
  try {
    const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}

export async function getArbitrageOpportunities() {
  // Placeholder for arbitrage detection
  return {
    opportunities: [],
    total_profit_potential: 0
  };
}

export async function getYieldFarmingOpportunities() {
  return {
    protocols: [
      {
        name: 'Compound',
        apy: 8.5,
        risk: 'medium'
      }
    ]
  };
}