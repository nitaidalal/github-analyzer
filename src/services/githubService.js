import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

export const fetchGitHubProfile = async (username) => {
    //fetcg user + repos in parallel

    const [userRes, repoRes] = await Promise.all([
      githubApi(`/users/${username}`),
      githubApi(`/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    const user = userRes.data;
    const repos = repoRes.data;

    //xtra insights
    const totalStars = repos.reduce((sum,repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum,repo) => sum + repo.forks_count, 0);

    //counting languages , sorting them by freq
    const languageCount = {};
    repos.forEach(repo => {
        if(repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });

    const topLanguages = Object.entries(languageCount)
        .sort((a,b) => b[1] - a[1])
        .slice(0,5)
        .map(([lang]) => lang); 

    const accountAgeDays = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));

    return {
      username: user.login,
      name: user.name || null,
      bio: user.bio || null,
      avatar_url: user.avatar_url,
      location: user.location || null,
      blog: user.blog || null,
      company: user.company || null,
      twitter_username: user.twitter_username || null,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      total_stars: totalStars,
      total_forks: totalForks,
      top_languages: topLanguages,
      account_age_days: accountAgeDays,
      hireable: user.hireable ? 1 : 0,
    };
};