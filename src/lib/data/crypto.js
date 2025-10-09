import axios from 'axios';

/**
 * Crypto data fetching and analysis service
 * Integrates with CoinGecko API for market data
 */

class CryptoService {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3';
        this.apiKey = process.env.COINGECKO_API_KEY || '';
    }

    /**
     * Get market data for multiple cryptocurrencies
     * @param {string[]} coinIds - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
     * @param {string} vsCurrency - Currency to compare against (default: 'usd')
     */
    async getMarketData(coinIds, vsCurrency = 'usd') {
        try {
            const response = await axios.get(`${this.baseURL}/simple/price`, {
                params: {
                    ids: coinIds.join(','),
                    vs_currencies: vsCurrency,
                    include_24hr_change: true,
                    include_24hr_vol: true,
                    include_market_cap: true,
                    include_last_updated_at: true
                },
                headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw new Error('Failed to fetch cryptocurrency market data');
        }
    }

    /**
     * Get trending cryptocurrencies
     */
    async getTrending() {
        try {
            const response = await axios.get(`${this.baseURL}/search/trending`, {
                headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
            });
            return response.data.coins;
        } catch (error) {
            console.error('Error fetching trending data:', error);
            throw new Error('Failed to fetch trending cryptocurrencies');
        }
    }

    /**
     * Analyze arbitrage opportunities between exchanges
     * @param {string} coinId - Cryptocurrency ID
     */
    async analyzeArbitrageOpportunities(coinId) {
        try {
            // Get price data from multiple exchanges
            const response = await axios.get(`${this.baseURL}/coins/${coinId}/tickers`, {
                headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
            });
            
            const tickers = response.data.tickers;
            const opportunities = [];

            // Find price discrepancies
            for (let i = 0; i < tickers.length; i++) {
                for (let j = i + 1; j < tickers.length; j++) {
                    const ticker1 = tickers[i];
                    const ticker2 = tickers[j];
                    
                    if (ticker1.target === ticker2.target) {
                        const priceDiff = Math.abs(ticker1.last - ticker2.last);
                        const percentDiff = (priceDiff / Math.min(ticker1.last, ticker2.last)) * 100;
                        
                        if (percentDiff > 0.5) { // More than 0.5% difference
                            opportunities.push({
                                coin: coinId,
                                exchange1: ticker1.market.name,
                                exchange2: ticker2.market.name,
                                price1: ticker1.last,
                                price2: ticker2.last,
                                priceDifference: priceDiff,
                                percentDifference: percentDiff.toFixed(2),
                                volume1: ticker1.volume,
                                volume2: ticker2.volume,
                                pair: ticker1.target
                            });
                        }
                    }
                }
            }

            return opportunities.sort((a, b) => b.percentDifference - a.percentDifference);
        } catch (error) {
            console.error('Error analyzing arbitrage opportunities:', error);
            throw new Error('Failed to analyze arbitrage opportunities');
        }
    }

    /**
     * Get DeFi protocols data for yield farming analysis
     */
    async getDeFiProtocols() {
        try {
            // This would integrate with DeFiPulse or similar API
            // For now, return mock data structure
            return [
                {
                    name: 'Uniswap V3',
                    tvl: 4200000000,
                    apy: 12.5,
                    risk: 'Medium',
                    token: 'UNI',
                    category: 'DEX'
                },
                {
                    name: 'Aave',
                    tvl: 8500000000,
                    apy: 8.2,
                    risk: 'Low',
                    token: 'AAVE',
                    category: 'Lending'
                },
                {
                    name: 'Compound',
                    tvl: 3200000000,
                    apy: 6.8,
                    risk: 'Low',
                    token: 'COMP',
                    category: 'Lending'
                }
            ];
        } catch (error) {
            console.error('Error fetching DeFi data:', error);
            throw new Error('Failed to fetch DeFi protocols data');
        }
    }

    /**
     * Calculate potential staking rewards
     * @param {string} coinId - Cryptocurrency ID
     * @param {number} amount - Amount to stake
     */
    async calculateStakingRewards(coinId, amount) {
        try {
            // Get current price
            const priceData = await this.getMarketData([coinId]);
            const currentPrice = priceData[coinId]?.usd || 0;
            
            // Staking APY data (this would come from actual staking providers)
            const stakingRates = {
                'ethereum': 4.5,
                'cardano': 5.2,
                'polkadot': 12.0,
                'solana': 7.8,
                'cosmos': 14.2
            };
            
            const apy = stakingRates[coinId] || 0;
            const dailyReward = (amount * apy) / 365 / 100;
            const monthlyReward = dailyReward * 30;
            const yearlyReward = amount * apy / 100;
            
            return {
                coin: coinId,
                amount,
                currentPrice,
                apy,
                rewards: {
                    daily: dailyReward,
                    monthly: monthlyReward,
                    yearly: yearlyReward
                },
                usdValue: {
                    daily: dailyReward * currentPrice,
                    monthly: monthlyReward * currentPrice,
                    yearly: yearlyReward * currentPrice
                }
            };
        } catch (error) {
            console.error('Error calculating staking rewards:', error);
            throw new Error('Failed to calculate staking rewards');
        }
    }

    /**
     * Detect market inefficiencies and potential opportunities
     * @param {string[]} coinIds - Array of coin IDs to analyze
     */
    async detectMarketInefficiencies(coinIds) {
        try {
            const opportunities = [];
            
            for (const coinId of coinIds) {
                // Get historical data for trend analysis
                const response = await axios.get(`${this.baseURL}/coins/${coinId}/market_chart`, {
                    params: {
                        vs_currency: 'usd',
                        days: 7,
                        interval: 'hourly'
                    },
                    headers: this.apiKey ? { 'X-CG-Demo-API-Key': this.apiKey } : {}
                });
                
                const prices = response.data.prices;
                const volumes = response.data.total_volumes;
                
                // Simple analysis for unusual volume spikes
                const avgVolume = volumes.reduce((sum, vol) => sum + vol[1], 0) / volumes.length;
                const recentVolume = volumes[volumes.length - 1][1];
                
                if (recentVolume > avgVolume * 2) {
                    opportunities.push({
                        coin: coinId,
                        type: 'Volume Spike',
                        description: 'Unusual trading volume detected',
                        currentVolume: recentVolume,
                        averageVolume: avgVolume,
                        volumeIncrease: ((recentVolume / avgVolume - 1) * 100).toFixed(2) + '%',
                        timestamp: new Date().toISOString()
                    });
                }
                
                // Price volatility analysis
                const recentPrices = prices.slice(-24); // Last 24 hours
                const priceChanges = recentPrices.map((price, index) => {
                    if (index === 0) return 0;
                    return Math.abs(price[1] - recentPrices[index - 1][1]) / recentPrices[index - 1][1];
                });
                
                const avgVolatility = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
                
                if (avgVolatility > 0.05) { // More than 5% average hourly change
                    opportunities.push({
                        coin: coinId,
                        type: 'High Volatility',
                        description: 'High price volatility detected - potential trading opportunity',
                        volatility: (avgVolatility * 100).toFixed(2) + '%',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            return opportunities;
        } catch (error) {
            console.error('Error detecting market inefficiencies:', error);
            throw new Error('Failed to detect market inefficiencies');
        }
    }
}

export default new CryptoService();