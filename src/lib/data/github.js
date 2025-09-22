import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export async function getRepositoryAnalytics(owner, repo) {
  try {
    const [repoData, releases, contributors] = await Promise.all([
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}`),
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`),
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors`)
    ]);

    return {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      watchers: repoData.data.watchers_count,
      language: repoData.data.language,
      size: repoData.data.size,
      releases: releases.data.length,
      contributors: contributors.data.length,
      created_at: repoData.data.created_at,
      updated_at: repoData.data.updated_at,
      monetization_score: calculateMonetizationScore(repoData.data)
    };
  } catch (error) {
    console.error('Error fetching repository analytics:', error);
    throw error;
  }
}

export async function getSponsorshipOpportunities(username) {
  try {
    const userResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}`);
    const reposResponse = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos`);
    
    const totalStars = reposResponse.data.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = reposResponse.data.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    return {
      profile: {
        followers: userResponse.data.followers,
        public_repos: userResponse.data.public_repos,
        total_stars: totalStars,
        total_forks: totalForks
      },
      sponsorship_potential: calculateSponsorshipPotential(userResponse.data, totalStars),
      recommended_actions: generateSponsorshipRecommendations(totalStars, userResponse.data.followers)
    };
  } catch (error) {
    console.error('Error analyzing sponsorship opportunities:', error);
    throw error;
  }
}

export async function getMarketplaceOpportunities(repos) {
  const opportunities = [];
  
  for (const repo of repos) {
    if (repo.language && repo.stargazers_count > 50) {
      opportunities.push({
        repo_name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        marketplace_potential: repo.language === 'JavaScript' ? 'high' : 'medium',
        suggested_price: calculateSuggestedPrice(repo)
      });
    }
  }
  
  return {
    total_opportunities: opportunities.length,
    opportunities: opportunities.slice(0, 10),
    estimated_revenue: opportunities.reduce((sum, opp) => sum + opp.suggested_price, 0)
  };
}

function calculateMonetizationScore(repo) {
  let score = 0;
  
  score += Math.min(repo.stargazers_count / 100, 50);
  score += Math.min(repo.forks_count / 50, 30);
  score += repo.language === 'JavaScript' ? 20 : 10;
  
  return Math.min(score, 100);
}

function calculateSponsorshipPotential(user, totalStars) {
  if (totalStars > 1000 && user.followers > 100) return 'high';
  if (totalStars > 500 || user.followers > 50) return 'medium';
  return 'low';
}

function generateSponsorshipRecommendations(stars, followers) {
  const recommendations = [];
  
  if (stars > 500) {
    recommendations.push('Enable GitHub Sponsors');
  }
  if (followers > 100) {
    recommendations.push('Create premium content or courses');
  }
  if (stars > 1000) {
    recommendations.push('Offer consulting services');
  }
  
  return recommendations;
}

function calculateSuggestedPrice(repo) {
  const basePrice = Math.min(repo.stargazers_count * 2, 500);
  const languageMultiplier = repo.language === 'JavaScript' ? 1.5 : 1.0;
  return Math.round(basePrice * languageMultiplier);
}