<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: '📊' },
		{ name: 'Crypto', href: '/crypto', icon: '₿' },
		{ name: 'GitHub', href: '/github', icon: '🐙' },
		{ name: 'KDP', href: '/kdp', icon: '📚' },
		{ name: 'Betting', href: '/betting', icon: '🎯' }
	];
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
	<!-- Navigation -->
	<nav class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<a href="/" class="flex items-center space-x-3">
						<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-sm">AI</span>
						</div>
						<span class="text-white font-semibold text-lg">Revenue Optimizer</span>
					</a>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden md:block">
					<div class="ml-10 flex items-baseline space-x-4">
						{#each navigation as item}
							<a
								href={item.href}
								class="{$page.url.pathname.startsWith(item.href)
									? 'bg-blue-600 text-white'
									: 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
							>
								<span>{item.icon}</span>
								<span>{item.name}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button
						type="button"
						class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
					>
						<span class="sr-only">Open main menu</span>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		{#if mounted}
			<slot />
		{:else}
			<div class="flex items-center justify-center min-h-screen">
				<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="bg-gray-800 border-t border-gray-700 mt-12">
		<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
			<div class="text-center text-gray-400 text-sm">
				<p>&copy; 2025 AI Revenue Optimizer. Built with SvelteKit & AI.</p>
			</div>
		</div>
	</footer>
</div>