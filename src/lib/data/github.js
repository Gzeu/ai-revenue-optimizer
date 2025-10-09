import axios from 'axios';

/**
 * GitHub monetization and repository analysis service
 * Analyzes repositories for sponsorship potential and monetization opportunities
 */

class GitHubService {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.token = process.env.GITHUB_TOKEN || '';
        this.headers = {
            'Authorization': this.token ? `Bearer ${this.token}` : '',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AI-Revenue-Optimizer'
        };
    }

    /**
     * Get user repositories with detailed analytics
     * @param {string} username - GitHub username
     * @param {string} sort - Sort order (updated, created, pushed, full_name)
     */
    async getUserRepositories(username, sort = 'updated') {
        try {
            const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
                headers: this.headers,
                params: {
                    sort,
                    per_page: 100,
                    type: 'all'
                }
            });
            
            return response.data.map(repo => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                watchers: repo.watchers_count,
                size: repo.size,
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                pushedAt: repo.pushed_at,
                topics: repo.topics,
                license: repo.license?.name,
                hasPages: repo.has_pages,
                archived: repo.archived,
                disabled: repo.disabled,
                private: repo.private,
                url: repo.html_url,
                cloneUrl: repo.clone_url,
                homepage: repo.homepage,
                openIssues: repo.open_issues_count
            }));
        } catch (error) {
            console.error('Error fetching repositories:', error);
            throw new Error('Failed to fetch GitHub repositories');
        }
    }

    /**
     * Analyze repository for monetization potential
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     */
    async analyzeRepositoryPotential(owner, repo) {
        try {
            // Get repository data
            const repoResponse = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
                headers: this.headers
            });
            
            // Get contributors
            const contributorsResponse = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/contributors`, {
                headers: this.headers,
                params: { per_page: 100 }
            });
            
            // Get traffic data (requires push access)
            let trafficData = null;
            try {
                const trafficResponse = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/traffic/views`, {
                    headers: this.headers
                });
                trafficData = trafficResponse.data;
            } catch (error) {
                console.log('Traffic data not accessible (requires push access)');
            }
            
            // Get releases
            const releasesResponse = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/releases`, {
                headers: this.headers,
                params: { per_page: 10 }
            });
            
            const repoData = repoResponse.data;
            const contributors = contributorsResponse.data;
            const releases = releasesResponse.data;
            
            // Calculate monetization score
            const score = this.calculateMonetizationScore({
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                watchers: repoData.watchers_count,
                contributors: contributors.length,
                releases: releases.length,
                hasPages: repoData.has_pages,
                language: repoData.language,
                topics: repoData.topics,
                size: repoData.size,
                openIssues: repoData.open_issues_count,
                createdAt: new Date(repoData.created_at),
                lastUpdate: new Date(repoData.updated_at)
            });
            
            return {
                repository: {
                    name: repoData.name,
                    fullName: repoData.full_name,
                    description: repoData.description,
                    url: repoData.html_url,
                    homepage: repoData.homepage
                },
                metrics: {
                    stars: repoData.stargazers_count,
                    forks: repoData.forks_count,
                    watchers: repoData.watchers_count,
                    contributors: contributors.length,
                    releases: releases.length,
                    openIssues: repoData.open_issues_count,
                    language: repoData.language,
                    topics: repoData.topics,
                    size: repoData.size
                },
                traffic: trafficData,
                monetizationScore: score.total,
                scoreBreakdown: score.breakdown,
                recommendations: this.generateRecommendations(score, repoData),
                potentialRevenue: this.estimateRevenuePotential(score.total, repoData.stargazers_count)
            };
        } catch (error) {
            console.error('Error analyzing repository:', error);
            throw new Error('Failed to analyze repository potential');
        }
    }

    /**
     * Calculate monetization score based on various factors
     */
    calculateMonetizationScore(data) {
        const weights = {
            stars: 0.25,
            forks: 0.15,
            watchers: 0.10,
            contributors: 0.15,
            releases: 0.10,
            activity: 0.15,
            quality: 0.10
        };
        
        // Normalize metrics (0-100 scale)
        const starsScore = Math.min(data.stars / 1000 * 100, 100);
        const forksScore = Math.min(data.forks / 500 * 100, 100);
        const watchersScore = Math.min(data.watchers / 200 * 100, 100);
        const contributorsScore = Math.min(data.contributors / 50 * 100, 100);
        const releasesScore = Math.min(data.releases / 20 * 100, 100);
        
        // Activity score based on last update
        const daysSinceUpdate = (new Date() - data.lastUpdate) / (1000 * 60 * 60 * 24);
        const activityScore = Math.max(0, 100 - (daysSinceUpdate / 30 * 50));
        
        // Quality indicators
        let qualityScore = 0;
        if (data.hasPages) qualityScore += 20;
        if (data.releases > 0) qualityScore += 20;
        if (data.topics && data.topics.length > 0) qualityScore += 20;
        if (data.openIssues < data.stars * 0.1) qualityScore += 20; // Low issue ratio
        if (data.language) qualityScore += 20;
        
        const breakdown = {
            stars: starsScore * weights.stars,
            forks: forksScore * weights.forks,
            watchers: watchersScore * weights.watchers,
            contributors: contributorsScore * weights.contributors,
            releases: releasesScore * weights.releases,
            activity: activityScore * weights.activity,
            quality: qualityScore * weights.quality
        };
        
        const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
        
        return { total: Math.round(total), breakdown };
    }

    /**
     * Generate monetization recommendations
     */
    generateRecommendations(score, repoData) {
        const recommendations = [];
        
        if (score.total >= 70) {
            recommendations.push({
                type: 'GitHub Sponsors',
                priority: 'High',
                description: 'Your repository has excellent metrics for GitHub Sponsors',
                action: 'Set up GitHub Sponsors profile and promote it in your README'
            });
        }
        
        if (repoData.stargazers_count > 500) {
            recommendations.push({
                type: 'Premium Features',
                priority: 'High',
                description: 'Consider offering premium features or enterprise version',
                action: 'Create a paid tier with advanced features or support'
            });
        }
        
        if (!repoData.has_pages && score.total > 50) {
            recommendations.push({
                type: 'Documentation Site',
                priority: 'Medium',
                description: 'Create a professional documentation site',
                action: 'Enable GitHub Pages and create comprehensive documentation'
            });
        }
        
        if (repoData.topics.length === 0) {
            recommendations.push({
                type: 'SEO Optimization',
                priority: 'Medium',
                description: 'Add relevant topics to improve discoverability',
                action: 'Add 3-5 relevant topics to your repository'
            });
        }
        
        if (score.breakdown.releases < 5) {
            recommendations.push({
                type: 'Release Strategy',
                priority: 'Medium',
                description: 'Regular releases show active maintenance',
                action: 'Create regular releases with proper versioning and changelogs'
            });
        }
        
        return recommendations;
    }

    /**
     * Estimate potential monthly revenue
     */
    estimateRevenuePotential(score, stars) {
        let baseRevenue = 0;
        
        // Base estimation based on stars and score
        if (score >= 80 && stars >= 1000) {
            baseRevenue = stars * 0.5; // $0.50 per star for top-tier repos
        } else if (score >= 60 && stars >= 500) {
            baseRevenue = stars * 0.3; // $0.30 per star for good repos
        } else if (score >= 40 && stars >= 100) {
            baseRevenue = stars * 0.1; // $0.10 per star for decent repos
        } else if (stars >= 50) {
            baseRevenue = stars * 0.05; // $0.05 per star for small repos
        }
        
        return {
            conservative: Math.floor(baseRevenue * 0.1), // 10% of base
            realistic: Math.floor(baseRevenue * 0.3), // 30% of base
            optimistic: Math.floor(baseRevenue * 0.6) // 60% of base
        };
    }

    /**
     * Get marketplace opportunities for repository
     */
    async getMarketplaceOpportunities(repoData) {
        const opportunities = [];
        
        // GitHub Marketplace
        if (repoData.topics.includes('github-action') || repoData.name.includes('action')) {
            opportunities.push({
                platform: 'GitHub Marketplace',
                type: 'GitHub Action',
                potential: 'High',
                description: 'Publish as a GitHub Action on the marketplace',
                estimatedRevenue: '$100-1000/month'
            });
        }
        
        // VS Code Extensions
        if (repoData.language === 'TypeScript' && repoData.topics.includes('vscode')) {
            opportunities.push({
                platform: 'VS Code Marketplace',
                type: 'Extension',
                potential: 'Medium',
                description: 'Package as VS Code extension',
                estimatedRevenue: '$50-500/month'
            });
        }
        
        // NPM Packages
        if (repoData.language === 'JavaScript' || repoData.language === 'TypeScript') {
            opportunities.push({
                platform: 'NPM',
                type: 'Package',
                potential: 'Medium',
                description: 'Publish as NPM package with premium features',
                estimatedRevenue: '$20-200/month'
            });
        }
        
        // Docker Hub
        if (repoData.topics.includes('docker') || repoData.name.includes('docker')) {
            opportunities.push({
                platform: 'Docker Hub',
                type: 'Container Image',
                potential: 'Medium',
                description: 'Publish optimized container images',
                estimatedRevenue: '$30-300/month'
            });
        }
        
        return opportunities;
    }

    /**
     * Analyze competitor repositories in the same niche
     */
    async analyzeCompetitors(language, topics, limit = 10) {
        try {
            const query = `language:${language} ${topics.join(' ')} stars:>100`;
            const response = await axios.get(`${this.baseURL}/search/repositories`, {
                headers: this.headers,
                params: {
                    q: query,
                    sort: 'stars',
                    order: 'desc',
                    per_page: limit
                }
            });
            
            return response.data.items.map(repo => ({
                name: repo.name,
                fullName: repo.full_name,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                topics: repo.topics,
                hasSponsors: repo.has_sponsors || false,
                url: repo.html_url,
                description: repo.description
            }));
        } catch (error) {
            console.error('Error analyzing competitors:', error);
            throw new Error('Failed to analyze competitor repositories');
        }
    }
}

export default new GitHubService();