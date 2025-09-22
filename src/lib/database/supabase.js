import { createClient } from '@supabase/supabase-js';
import { 
	PUBLIC_SUPABASE_URL, 
	PUBLIC_SUPABASE_ANON_KEY 
} from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

/**
 * Supabase client for browser/client-side operations
 * Uses the anonymous key for public access
 */
export const supabase = createClient(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	{
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true
		}
	}
);

/**
 * Supabase admin client for server-side operations
 * Uses the service role key for full access
 */
export const supabaseAdmin = createClient(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);

/**
 * Database helper functions for the AI Revenue Optimizer
 */
export class DatabaseService {
	constructor(client = supabase) {
		this.client = client;
	}

	/**
	 * User management
	 */
	async createUser(userData) {
		try {
			const { data, error } = await this.client
				.from('users')
				.insert([
					{
						...userData,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				])
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error creating user:', error);
			throw error;
		}
	}

	async getUserById(userId) {
		try {
			const { data, error } = await this.client
				.from('users')
				.select('*')
				.eq('id', userId)
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching user:', error);
			throw error;
		}
	}

	async updateUser(userId, updates) {
		try {
			const { data, error } = await this.client
				.from('users')
				.update({
					...updates,
					updated_at: new Date().toISOString()
				})
				.eq('id', userId)
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error updating user:', error);
			throw error;
		}
	}

	/**
	 * Platform connections management
	 */
	async addPlatformConnection(userId, platformData) {
		try {
			const { data, error } = await this.client
				.from('platform_connections')
				.insert([
					{
						user_id: userId,
						...platformData,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				])
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error adding platform connection:', error);
			throw error;
		}
	}

	async getUserPlatforms(userId) {
		try {
			const { data, error } = await this.client
				.from('platform_connections')
				.select('*')
				.eq('user_id', userId)
				.eq('is_active', true);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching user platforms:', error);
			throw error;
		}
	}

	/**
	 * Opportunities management
	 */
	async saveOpportunity(opportunityData) {
		try {
			const { data, error } = await this.client
				.from('opportunities')
				.insert([
					{
						...opportunityData,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					}
				])
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error saving opportunity:', error);
			throw error;
		}
	}

	async getUserOpportunities(userId, limit = 50) {
		try {
			const { data, error } = await this.client
				.from('opportunities')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false })
				.limit(limit);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching opportunities:', error);
			throw error;
		}
	}

	async updateOpportunityStatus(opportunityId, status, executionData = null) {
		try {
			const updates = {
				status,
				updated_at: new Date().toISOString()
			};

			if (executionData) {
				updates.execution_data = executionData;
				updates.executed_at = new Date().toISOString();
			}

			const { data, error } = await this.client
				.from('opportunities')
				.update(updates)
				.eq('id', opportunityId)
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error updating opportunity status:', error);
			throw error;
		}
	}

	/**
	 * Analytics and performance tracking
	 */
	async saveAnalyticsEvent(userId, eventData) {
		try {
			const { data, error } = await this.client
				.from('analytics_events')
				.insert([
					{
						user_id: userId,
						...eventData,
						created_at: new Date().toISOString()
					}
				]);

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error saving analytics event:', error);
			throw error;
		}
	}

	async getUserAnalytics(userId, timeframe = '30d') {
		try {
			// Calculate date range
			const endDate = new Date();
			const startDate = new Date();
			
			switch (timeframe) {
				case '7d':
					startDate.setDate(startDate.getDate() - 7);
					break;
				case '30d':
					startDate.setDate(startDate.getDate() - 30);
					break;
				case '90d':
					startDate.setDate(startDate.getDate() - 90);
					break;
				default:
					startDate.setDate(startDate.getDate() - 30);
			}

			const { data, error } = await this.client
				.from('analytics_events')
				.select('*')
				.eq('user_id', userId)
				.gte('created_at', startDate.toISOString())
				.lte('created_at', endDate.toISOString())
				.order('created_at', { ascending: false });

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error fetching user analytics:', error);
			throw error;
		}
	}

	/**
	 * Revenue tracking
	 */
	async saveRevenueRecord(userId, revenueData) {
		try {
			const { data, error } = await this.client
				.from('revenue_records')
				.insert([
					{
						user_id: userId,
						...revenueData,
						created_at: new Date().toISOString()
					}
				])
				.select();

			if (error) throw error;
			return data[0];
		} catch (error) {
			console.error('Error saving revenue record:', error);
			throw error;
		}
	}

	async getUserRevenueSummary(userId, timeframe = '30d') {
		try {
			const endDate = new Date();
			const startDate = new Date();
			
			switch (timeframe) {
				case '7d':
					startDate.setDate(startDate.getDate() - 7);
					break;
				case '30d':
					startDate.setDate(startDate.getDate() - 30);
					break;
				case '90d':
					startDate.setDate(startDate.getDate() - 90);
					break;
				default:
					startDate.setDate(startDate.getDate() - 30);
			}

			const { data, error } = await this.client
				.from('revenue_records')
				.select('platform, amount, revenue_type, created_at')
				.eq('user_id', userId)
				.gte('created_at', startDate.toISOString())
				.lte('created_at', endDate.toISOString());

			if (error) throw error;

			// Calculate summary statistics
			const summary = {
				totalRevenue: 0,
				platformBreakdown: {},
				typeBreakdown: {},
				dailyRevenue: []
			};

			data.forEach(record => {
				summary.totalRevenue += record.amount;
				
				// Platform breakdown
				if (!summary.platformBreakdown[record.platform]) {
					summary.platformBreakdown[record.platform] = 0;
				}
				summary.platformBreakdown[record.platform] += record.amount;

				// Type breakdown
				if (!summary.typeBreakdown[record.revenue_type]) {
					summary.typeBreakdown[record.revenue_type] = 0;
				}
				summary.typeBreakdown[record.revenue_type] += record.amount;
			});

			return summary;
		} catch (error) {
			console.error('Error fetching revenue summary:', error);
			throw error;
		}
	}

	/**
	 * Real-time subscriptions
	 */
	subscribeToOpportunities(userId, callback) {
		return this.client
			.channel('opportunities')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'opportunities',
					filter: `user_id=eq.${userId}`
				},
				callback
			)
			.subscribe();
	}

	subscribeToRevenue(userId, callback) {
		return this.client
			.channel('revenue')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'revenue_records',
					filter: `user_id=eq.${userId}`
				},
				callback
			)
			.subscribe();
	}
}

// Export singleton instances
export const db = new DatabaseService(supabase);
export const adminDb = new DatabaseService(supabaseAdmin);