<script>
	import { onMount } from 'svelte';

	let stats = {
		totalRevenue: 0,
		ActiveOpportunities: 0,
		SuccessRate: 0,
		PlatformsConnected: 0
	};

	const features = [
		{
			icon: '🧠',
			title: 'AI-Powered Analysis',
			description: 'Advanced algorithms identify profit opportunities across all your platforms'
		},
		{
			icon: '⚡',
			title: 'Real-time Automation',
			description: 'Automated execution of low-risk, high-confidence profit opportunities'
		},
		{
			icon: '📊',
			title: 'Multi-Platform Analytics',
			description: 'Comprehensive tracking across crypto, GitHub, KDP, and betting platforms'
		},
		{
			icon: '🔒',
			title: 'Zero-Cost Setup',
			description: 'Leverage existing assets and activities - no upfront investment required'
		}
	];

	const platforms = [
		{ name: 'Binance', status: 'connected', revenue: '$1,245' },
		{ name: 'GitHub', status: 'connected', revenue: '$890' },
		{ name: 'Amazon KDP', status: 'pending', revenue: '$567' },
		{ name: 'Betano', status: 'connected', revenue: '$432' }
	];

	onMount(() => {
		// Simulate loading stats
		setTimeout(() => {
			stats = {
				totalRevenue: 3134,
				activeOpportunities: 12,
				successRate: 87,
				platformsConnected: 4
			};
		}, 1000);
	});
</script>

<svelte:head>
	<title>AI Revenue Optimizer - Automate Your Profit Opportunities</title>
	<meta name="description" content="Zero-cost platform that analyzes and automates profit opportunities from existing activity across crypto, GitHub, KDP, and betting platforms." />
</svelte:head>

<!-- Hero Section -->
<div class="relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
		<div class="text-center">
			<div class="mb-8">
				<div class="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6">
					<span class="status-online mr-2"></span>
					<span class="text-sm text-blue-300">AI Engine Active</span>
				</div>
			</div>

			<h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
				Optimize Your
				<span class="gradient-text block">Revenue Streams</span>
				with AI
			</h1>

			<p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
				Zero-cost platform that analyzes and automates profit opportunities from your existing crypto trading, GitHub projects, KDP books, and betting activities.
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/dashboard" class="btn-primary text-lg px-8 py-3">
					Start Optimizing
				</a>
				<a href="#features" class="btn-secondary text-lg px-8 py-3">
					Learn More
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Stats Section -->
<div class="bg-gray-800/50 backdrop-blur-sm border-y border-gray-700 py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
			<div class="text-center">
				<div class="text-3xl font-bold text-green-400">${stats.totalRevenue}</div>
				<div class="text-sm text-gray-400 mt-1">Total Revenue</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-blue-400">{stats.activeOpportunities}</div>
				<div class="text-sm text-gray-400 mt-1">Active Opportunities</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-purple-400">{stats.successRate}%</div>
				<div class="text-sm text-gray-400 mt-1">Success Rate</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-yellow-400">{stats.platformsConnected}</div>
				<div class="text-sm text-gray-400 mt-1">Platforms Connected</div>
			</div>
		</div>
	</div>
</div>

<!-- Features Section -->
<div id="features" class="py-24 bg-gray-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-white mb-4">Powerful Features</h2>
			<p class="text-xl text-gray-400 max-w-2xl mx-auto">
				Leverage AI to maximize profits from your existing activities across multiple platforms
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each features as feature}
				<div class="card hover:scale-105 transition-transform">
					<div class="text-4xl mb-4">{feature.icon}</div>
					<h3 class="text-xl font-semibold text-white mb-3">{feature.title}</h3>
					<p class="text-gray-400">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Platforms Section -->
<div class="py-24 bg-gray-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-white mb-4">Connected Platforms</h2>
			<p class="text-xl text-gray-400">
				Monitor and optimize across all your revenue sources
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each platforms as platform}
				<div class="metric-card">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold text-white">{platform.name}</h3>
						<div class="{platform.status === 'connected' ? 'status-online' : 'status-offline'}"></div>
					</div>
					<div class="text-2xl font-bold text-green-400">{platform.revenue}</div>
					<div class="text-sm text-gray-400 capitalize">{platform.status}</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12">
			<a href="/dashboard" class="btn-primary text-lg px-8 py-3">
				View Full Dashboard
			</a>
		</div>
	</div>
</div>

<!-- CTA Section -->
<div class="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
	<div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
		<h2 class="text-3xl font-bold text-white mb-4">
			Ready to Optimize Your Revenue?
		</h2>
		<p class="text-xl text-blue-100 mb-8">
			Start analyzing your opportunities today - completely free to begin.
		</p>
		<a href="/dashboard" class="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
			Get Started Now
			<svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
			</svg>
		</a>
	</div>
</div>