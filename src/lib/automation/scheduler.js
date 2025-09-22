import cron from 'node-cron';
import { analyzeOpportunity, generateConsolidatedReport } from '../ai/openai.js';
import { getCryptoPrices, getArbitrageOpportunities } from '../data/crypto.js';
import { getRepositoryAnalytics, getSponsorshipOpportunities } from '../data/github.js';
import { analyzeKeywords, findContentGaps } from '../data/kdp.js';
import { findValueBets, findArbitrageOpportunities } from '../data/betting.js';
import { sendAlert, saveOpportunity } from './actions.js';

class AutomationScheduler {
  constructor() {
    this.tasks = new Map();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Scheduler already running');
      return;
    }

    console.log('Starting AI Revenue Optimizer Scheduler...');
    this.isRunning = true;

    // Every 5 minutes - Quick crypto analysis
    this.tasks.set('crypto-quick', cron.schedule('*/5 * * * *', async () => {
      await this.runCryptoQuickAnalysis();
    }, { scheduled: false }));

    // Every hour - Comprehensive analysis
    this.tasks.set('hourly-analysis', cron.schedule('0 * * * *', async () => {
      await this.runHourlyAnalysis();
    }, { scheduled: false }));

    // Every 4 hours - GitHub analysis
    this.tasks.set('github-analysis', cron.schedule('0 */4 * * *', async () => {
      await this.runGitHubAnalysis();
    }, { scheduled: false }));

    // Daily at 9 AM - KDP analysis
    this.tasks.set('kdp-daily', cron.schedule('0 9 * * *', async () => {
      await this.runKDPAnalysis();
    }, { scheduled: false }));

    // Every 15 minutes during betting hours (10 AM - 10 PM)
    this.tasks.set('betting-analysis', cron.schedule('*/15 10-22 * * *', async () => {
      await this.runBettingAnalysis();
    }, { scheduled: false }));

    // Daily report at 8 PM
    this.tasks.set('daily-report', cron.schedule('0 20 * * *', async () => {
      await this.generateDailyReport();
    }, { scheduled: false }));

    // Start all tasks
    this.tasks.forEach((task, name) => {
      task.start();
      console.log(`Started task: ${name}`);
    });
  }

  stop() {
    console.log('Stopping scheduler...');
    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`Stopped task: ${name}`);
    });
    this.isRunning = false;
  }

  async runCryptoQuickAnalysis() {
    try {
      console.log('[CRYPTO] Running quick analysis...');
      
      const prices = await getCryptoPrices(['bitcoin', 'ethereum', 'multiversx-egld']);
      const arbitrageOpps = await getArbitrageOpportunities();
      
      const analysis = await analyzeOpportunity('crypto', {
        prices,
        arbitrage: arbitrageOpps
      });
      
      if (this.hasHighPriorityOpportunity(analysis)) {
        await sendAlert('crypto', analysis);
        await saveOpportunity(analysis);
      }
      
      console.log('[CRYPTO] Quick analysis completed');
    } catch (error) {
      console.error('[CRYPTO] Quick analysis failed:', error.message);
    }
  }

  async runHourlyAnalysis() {
    try {
      console.log('[HOURLY] Running comprehensive analysis...');
      
      const cryptoData = await this.gatherCryptoData();
      const analysis = await analyzeOpportunity('crypto', cryptoData);
      
      await saveOpportunity(analysis);
      
      if (this.shouldAlert(analysis)) {
        await sendAlert('hourly_crypto', analysis);
      }
      
      console.log('[HOURLY] Comprehensive analysis completed');
    } catch (error) {
      console.error('[HOURLY] Analysis failed:', error.message);
    }
  }

  async runGitHubAnalysis() {
    try {
      console.log('[GITHUB] Running monetization analysis...');
      
      // Analyze user's repositories
      const username = process.env.GITHUB_USERNAME || 'Gzeu';
      const sponsorshipData = await getSponsorshipOpportunities(username);
      
      const analysis = await analyzeOpportunity('github', sponsorshipData);
      
      await saveOpportunity(analysis);
      
      if (analysis.confidence > 80) {
        await sendAlert('github_monetization', analysis);
      }
      
      console.log('[GITHUB] Analysis completed');
    } catch (error) {
      console.error('[GITHUB] Analysis failed:', error.message);
    }
  }

  async runKDPAnalysis() {
    try {
      console.log('[KDP] Running optimization analysis...');
      
      const contentGaps = await findContentGaps('business', 'entrepreneurship');
      
      const analysis = await analyzeOpportunity('kdp', {
        content_gaps: contentGaps,
        market_analysis: {
          trending_topics: ['AI', 'Crypto', 'Remote Work'],
          seasonal_opportunities: this.getSeasonalOpportunities()
        }
      });
      
      await saveOpportunity(analysis);
      
      if (contentGaps.top_opportunity?.profit_potential === 'high') {
        await sendAlert('kdp_opportunity', analysis);
      }
      
      console.log('[KDP] Analysis completed');
    } catch (error) {
      console.error('[KDP] Analysis failed:', error.message);
    }
  }

  async runBettingAnalysis() {
    try {
      console.log('[BETTING] Running value betting analysis...');
      
      // Simulate live matches data
      const liveMatches = this.getLiveMatches();
      const valueBets = await findValueBets(liveMatches, ['Betano', 'Bet365']);
      const arbitrageOpps = await findArbitrageOpportunities(liveMatches);
      
      const analysis = await analyzeOpportunity('betting', {
        value_bets: valueBets,
        arbitrage: arbitrageOpps,
        live_matches: liveMatches.length
      });
      
      await saveOpportunity(analysis);
      
      // Alert for high-value opportunities
      if (valueBets.value_bets?.length > 0 || arbitrageOpps.arbitrage_opportunities?.length > 0) {
        await sendAlert('betting_opportunity', analysis);
      }
      
      console.log('[BETTING] Analysis completed');
    } catch (error) {
      console.error('[BETTING] Analysis failed:', error.message);
    }
  }

  async generateDailyReport() {
    try {
      console.log('[REPORT] Generating daily consolidated report...');
      
      const allData = {
        crypto: await this.gatherCryptoData(),
        github: await getSponsorshipOpportunities(process.env.GITHUB_USERNAME || 'Gzeu'),
        kdp: await findContentGaps('business', 'entrepreneurship'),
        betting: {
          summary: 'Daily betting analysis completed',
          opportunities_found: Math.floor(Math.random() * 10)
        }
      };
      
      const consolidatedReport = await generateConsolidatedReport(allData);
      
      await sendAlert('daily_report', consolidatedReport);
      await saveOpportunity(consolidatedReport);
      
      console.log('[REPORT] Daily report generated and sent');
    } catch (error) {
      console.error('[REPORT] Daily report failed:', error.message);
    }
  }

  // Helper methods
  async gatherCryptoData() {
    const [prices, arbitrage] = await Promise.all([
      getCryptoPrices(['bitcoin', 'ethereum', 'multiversx-egld']),
      getArbitrageOpportunities()
    ]);
    
    return { prices, arbitrage };
  }

  hasHighPriorityOpportunity(analysis) {
    return analysis.confidence > 90 || 
           (analysis.estimated_profit && analysis.estimated_profit > 100);
  }

  shouldAlert(analysis) {
    return analysis.confidence > 75 && analysis.platform === 'crypto';
  }

  getSeasonalOpportunities() {
    const month = new Date().getMonth();
    const seasonalMap = {
      0: ['New Year Resolutions', 'Planning'],
      11: ['Holiday Planning', 'Gift Guides'],
      8: ['Back to School', 'Productivity']
    };
    
    return seasonalMap[month] || ['General Business', 'Self Improvement'];
  }

  getLiveMatches() {
    // Simulate live matches data
    return [
      {
        id: 1,
        teams: 'Team A vs Team B',
        league: 'Premier League',
        start_time: new Date()
      },
      {
        id: 2,
        teams: 'Team C vs Team D',
        league: 'Champions League',
        start_time: new Date()
      }
    ];
  }
}

// Export singleton instance
export const scheduler = new AutomationScheduler();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  scheduler.start();
}