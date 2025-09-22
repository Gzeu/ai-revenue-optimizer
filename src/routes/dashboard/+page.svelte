<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Stores for reactive data
	const opportunities = writable([]);
	const analytics = writable({
		totalRevenue: 0,
		dailyChange: 0,
		activeOpportunities: 0,
		successRate: 0
	});

	let isLoading = true;
	let selectedTimeframe = '7d';

	// Mock data for demonstration
	const mockOpportunities = [
		{
			id: 1,
			platform: 'Binance',
			type: 'Arbitrage',
			title: 'EGLD/USDT Price Discrepancy',
			potentialProfit: 145.50,
			risk: 'Low',
			confidence: 94,
			status: 'active',
			timeRemaining: '2h 15m',
			icon: '₿'
		},
		{
			id: 2,
			platform: 'GitHub',
			type: 'Sponsorship',
			title: 'AI Revenue Optimizer - Premium Features',
			potentialProfit: 89.00,
			risk: 'Low',
			confidence: 87,
			status: 'pending',
			timeRemaining: '5d 12h',
			icon: '🐙'
		},
		{
			id: 3,
			platform: 'Amazon KDP',
			type: 'Keyword Optimization',
			title: 'Coloring Book Series Expansion',
			potentialProfit: 234.20,
			risk: 'Medium',
			confidence: 78,
			status: 'analyzing',
			timeRemaining: '1d 8h',
			icon: '📚'
		},
		{
			id: 4,
			platform: 'Betano',
			type: 'Value Betting',
			title: 'UEFA Champions League Odds',
			potentialProfit: 67.30,
			risk: 'High',
			confidence: 72,
			status: 'executed',
			timeRemaining: 'Completed',
			icon: '⚽'
		}
	];

	const platformStats = [
		{ name: 'Binance', revenue: 1245.50, change: +12.3, status: 'connected' },
		{ name: 'GitHub', revenue: 890.20, change: +8.7, status: 'connected' },
		{ name: 'Amazon KDP', revenue: 567.80, change: -2.1, status: 'connected' },
		{ name: 'Betano', revenue: 432.10, change: +15.4, status: 'connected' }
	];

	function getStatusColor(status) {
		switch (status) {
			case 'active': return 'text-green-400';
			case 'pending': return 'text-yellow-400';
			case 'analyzing': return 'text-blue-400';
			case 'executed': return 'text-gray-400';
			default: return 'text-gray-400';
		}
	}

	function getRiskColor(risk) {
		switch (risk) {
			case 'Low': return 'text-green-400';
			case 'Medium': return 'text-yellow-400';
			case 'High': return 'text-red-400';
			default: return 'text-gray-400';
		}
	}

	function handleOpportunityAction(id, action) {
		console.log(`${action} opportunity ${id}`);
		// Implement action logic here
	}

	onMount(() => {
		// Simulate loading data
		setTimeout(() => {
			opportunities.set(mockOpportunities);
			analytics.set({
				totalRevenue: 3135.60,
				dailyChange: 8.4,
				activeOpportunities: 12,
				successRate: 87.3
			});
			isLoading = false;
		}, 1500);
	});
</script>

<svelte:head>
	<title>Dashboard - AI Revenue Optimizer</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-white mb-2">Revenue Dashboard</h1>
				<p class="text-gray-400">Real-time analysis of profit opportunities across all platforms</p>
			</div>
			<div class="flex items-center space-x-3">
				<div class="status-online"></div>
				<span class="text-sm text-green-400">AI Engine Active</span>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading-dots">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	{:else}
		<!-- Analytics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="metric-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Total Revenue</p>
						<p class="text-2xl font-bold text-white">${$analytics.totalRevenue.toFixed(2)}</p>
					</div>
					<div class="text-green-400 text-right">
						<p class="text-sm">+{$analytics.dailyChange}%</p>
						<p class="text-xs text-gray-500">24h</p>
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Active Opportunities</p>
						<p class="text-2xl font-bold text-white">{$analytics.activeOpportunities}</p>
					</div>
					<div class="text-blue-400">
						<span class="text-2xl">🎯</span>
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Success Rate</p>
						<p class="text-2xl font-bold text-white">{$analytics.successRate}%</p>
					</div>
					<div class="text-purple-400">
						<span class="text-2xl">📈</span>
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Platforms</p>
						<p class="text-2xl font-bold text-white">4</p>
					</div>
					<div class="text-yellow-400">
						<span class="text-2xl">🔗</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Opportunities Section -->
		<div class="grid lg:grid-cols-3 gap-8 mb-8">
			<!-- Active Opportunities -->
			<div class="lg:col-span-2">
				<div class="card">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-semibold text-white">Active Opportunities</h2>
						<button class="btn-secondary text-sm px-3 py-1">Refresh</button>
					</div>

					<div class="space-y-4">
						{#each $opportunities as opportunity}
							<div class="bg-gray-700 rounded-lg p-4 border border-gray-600">
								<div class="flex items-start justify-between">
									<div class="flex items-start space-x-3">
										<div class="text-2xl">{opportunity.icon}</div>
										<div>
											<h3 class="font-medium text-white">{opportunity.title}</h3>
											<div class="flex items-center space-x-4 mt-1 text-sm">
												<span class="text-gray-400">{opportunity.platform}</span>
												<span class="text-blue-400">{opportunity.type}</span>
												<span class="{getRiskColor(opportunity.risk)}">Risk: {opportunity.risk}</span>
											</div>
										</div>
									</div>

									<div class="flex items-center justify-between mt-3">
										<div class="flex items-center space-x-4">
											<div class="text-green-400 font-semibold">
												+${opportunity.potentialProfit.toFixed(2)}
											</div>
											<div class="text-sm text-gray-400">
												{opportunity.confidence}% confidence
											</div>
										</div>

										<div class="flex items-center space-x-2">
											<span class="text-sm text-gray-400">{opportunity.timeRemaining}</span>
											<span class="{getStatusColor(opportunity.status)} text-sm capitalize">
												{opportunity.status}
											</span>
										</div>
									</div>

									{#if opportunity.status === 'active'}
										<div class="flex space-x-2 mt-3">
											<button 
												class="btn-primary text-sm px-3 py-1"
												on:click={() => handleOpportunityAction(opportunity.id, 'execute')}
											>
												Execute
											</button>
											<button 
												class="btn-secondary text-sm px-3 py-1"
												on:click={() => handleOpportunityAction(opportunity.id, 'analyze')}
											>
												Analyze
											</button>
										</div>
									{/if}
								</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Platform Performance -->
			<div>
				<div class="card">
					<h2 class="text-xl font-semibold text-white mb-6">Platform Performance</h2>
					
					<div class="space-y-4">
						{#each platformStats as platform}
							<div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
								<div class="flex items-center space-x-3">
									<div class="status-online"></div>
									<div>
										<div class="font-medium text-white">{platform.name}</div>
										<div class="text-sm text-gray-400">${platform.revenue.toFixed(2)}</div>
									</div>
								</div>
								<div class="text-right">
									<div class="{platform.change >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium">
										{platform.change >= 0 ? '+' : ''}{platform.change}%
									</div>
									<div class="text-xs text-gray-500">24h</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-6">
						<button class="w-full btn-secondary">Configure Platforms</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>