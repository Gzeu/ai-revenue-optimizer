import { supabase } from '../database/supabase.js';

/**
 * Send alert notifications for opportunities
 */
export async function sendAlert(type, data) {
  try {
    console.log(`[ALERT] Sending ${type} alert...`);
    
    const alert = {
      type,
      message: generateAlertMessage(type, data),
      data: JSON.stringify(data),
      priority: calculatePriority(type, data),
      created_at: new Date().toISOString()
    };
    
    // Save to database
    const { error } = await supabase
      .from('alerts')
      .insert([alert]);
    
    if (error) {
      console.error('Database alert save failed:', error);
    }
    
    // Send notification based on priority
    if (alert.priority === 'high') {
      await sendHighPriorityNotification(alert);
    }
    
    console.log(`[ALERT] ${type} alert sent successfully`);
    return alert;
  } catch (error) {
    console.error(`[ALERT] Failed to send ${type} alert:`, error.message);
    throw error;
  }
}

/**
 * Save opportunity to database
 */
export async function saveOpportunity(analysis) {
  try {
    const opportunity = {
      platform: analysis.platform,
      analysis: JSON.stringify(analysis.analysis || analysis),
      confidence: analysis.confidence || 0,
      estimated_profit: analysis.estimated_profit || 0,
      timestamp: analysis.timestamp || new Date().toISOString(),
      status: 'detected'
    };
    
    const { data, error } = await supabase
      .from('opportunities')
      .insert([opportunity])
      .select();
    
    if (error) {
      console.error('Failed to save opportunity:', error);
      throw error;
    }
    
    console.log(`[DB] Opportunity saved: ${analysis.platform}`);
    return data[0];
  } catch (error) {
    console.error('[DB] Save opportunity failed:', error.message);
    throw error;
  }
}

/**
 * Execute automated trading actions (with safety checks)
 */
export async function executeAutomatedAction(opportunity) {
  try {
    // Safety checks
    if (!opportunity || opportunity.confidence < 95) {
      console.log('[ACTION] Skipping automated action - insufficient confidence');
      return null;
    }
    
    if (opportunity.estimated_profit < 50) {
      console.log('[ACTION] Skipping automated action - profit too low');
      return null;
    }
    
    console.log(`[ACTION] Executing automated action for ${opportunity.platform}...`);
    
    let result = null;
    
    switch (opportunity.platform) {
      case 'crypto':
        result = await executeCryptoAction(opportunity);
        break;
      case 'betting':
        result = await executeBettingAction(opportunity);
        break;
      default:
        console.log(`[ACTION] No automated action available for ${opportunity.platform}`);
        return null;
    }
    
    // Log the action
    await logAutomatedAction(opportunity, result);
    
    return result;
  } catch (error) {
    console.error('[ACTION] Automated action failed:', error.message);
    await logAutomatedAction(opportunity, { error: error.message });
    throw error;
  }
}

/**
 * Monitor and update opportunity status
 */
export async function updateOpportunityStatus(opportunityId, status, result = null) {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (result) {
      updateData.result = JSON.stringify(result);
    }
    
    const { error } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', opportunityId);
    
    if (error) {
      console.error('Failed to update opportunity status:', error);
      throw error;
    }
    
    console.log(`[DB] Opportunity ${opportunityId} status updated to ${status}`);
  } catch (error) {
    console.error('[DB] Update status failed:', error.message);
    throw error;
  }
}

/**
 * Get performance metrics for automated actions
 */
export async function getAutomationPerformance() {
  try {
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    const { data: actions, error: actionsError } = await supabase
      .from('automated_actions')
      .select('*')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (actionsError) throw actionsError;
    
    const metrics = {
      total_opportunities: opportunities.length,
      opportunities_by_platform: groupByPlatform(opportunities),
      automated_actions: actions.length,
      success_rate: calculateSuccessRate(actions),
      total_profit: calculateTotalProfit(actions),
      average_confidence: calculateAverageConfidence(opportunities),
      performance_by_platform: calculatePlatformPerformance(opportunities, actions)
    };
    
    return metrics;
  } catch (error) {
    console.error('[METRICS] Failed to get automation performance:', error.message);
    throw error;
  }
}

// Helper functions
function generateAlertMessage(type, data) {
  const messages = {
    crypto: `Crypto opportunity detected with ${data.confidence}% confidence. Estimated profit: $${data.estimated_profit || 0}`,
    github_monetization: `GitHub monetization opportunity: ${data.analysis?.summary || 'New opportunity detected'}`,
    kdp_opportunity: `KDP content gap identified with high profit potential`,
    betting_opportunity: `Value betting opportunity found with ${data.confidence}% confidence`,
    daily_report: `Daily analysis completed. Total estimated profit: $${data.total_estimated_profit || 0}`
  };
  
  return messages[type] || `New ${type} opportunity detected`;
}

function calculatePriority(type, data) {
  if (data.confidence > 90 || (data.estimated_profit && data.estimated_profit > 200)) {
    return 'high';
  }
  if (data.confidence > 75 || (data.estimated_profit && data.estimated_profit > 50)) {
    return 'medium';
  }
  return 'low';
}

async function sendHighPriorityNotification(alert) {
  // In production, integrate with email, Slack, Discord, or push notifications
  console.log(`🚨 HIGH PRIORITY ALERT: ${alert.message}`);
  
  // Placeholder for notification service integration
  // await emailService.send(alert);
  // await slackService.send(alert);
  // await discordService.send(alert);
}

async function executeCryptoAction(opportunity) {
  // Placeholder for crypto trading automation
  // IMPORTANT: Only implement with proper risk management
  console.log('[CRYPTO] Simulating crypto action execution...');
  
  return {
    action: 'simulated_trade',
    amount: 100,
    result: 'success',
    profit: opportunity.estimated_profit * 0.8 // 80% of estimated
  };
}

async function executeBettingAction(opportunity) {
  // Placeholder for betting automation
  // IMPORTANT: Implement with strict bankroll management
  console.log('[BETTING] Simulating betting action execution...');
  
  return {
    action: 'simulated_bet',
    stake: 50,
    result: 'placed',
    expected_return: opportunity.estimated_profit
  };
}

async function logAutomatedAction(opportunity, result) {
  try {
    const actionLog = {
      opportunity_id: opportunity.id,
      platform: opportunity.platform,
      action_type: result.action || 'unknown',
      result: JSON.stringify(result),
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('automated_actions')
      .insert([actionLog]);
    
    if (error) {
      console.error('Failed to log automated action:', error);
    }
  } catch (error) {
    console.error('Action logging failed:', error.message);
  }
}

function groupByPlatform(opportunities) {
  return opportunities.reduce((acc, opp) => {
    acc[opp.platform] = (acc[opp.platform] || 0) + 1;
    return acc;
  }, {});
}

function calculateSuccessRate(actions) {
  if (!actions.length) return 0;
  const successful = actions.filter(action => {
    try {
      const result = JSON.parse(action.result);
      return result.result === 'success' || result.result === 'placed';
    } catch {
      return false;
    }
  }).length;
  
  return (successful / actions.length) * 100;
}

function calculateTotalProfit(actions) {
  return actions.reduce((total, action) => {
    try {
      const result = JSON.parse(action.result);
      return total + (result.profit || 0);
    } catch {
      return total;
    }
  }, 0);
}

function calculateAverageConfidence(opportunities) {
  if (!opportunities.length) return 0;
  const totalConfidence = opportunities.reduce((sum, opp) => sum + (opp.confidence || 0), 0);
  return totalConfidence / opportunities.length;
}

function calculatePlatformPerformance(opportunities, actions) {
  const platforms = ['crypto', 'github', 'kdp', 'betting'];
  
  return platforms.reduce((acc, platform) => {
    const platformOpps = opportunities.filter(opp => opp.platform === platform);
    const platformActions = actions.filter(action => action.platform === platform);
    
    acc[platform] = {
      opportunities: platformOpps.length,
      actions: platformActions.length,
      success_rate: calculateSuccessRate(platformActions),
      total_profit: calculateTotalProfit(platformActions),
      average_confidence: calculateAverageConfidence(platformOpps)
    };
    
    return acc;
  }, {});
}