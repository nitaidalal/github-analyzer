import pool from '../config/db.js';
import { fetchGitHubProfile } from '../services/githubService.js';

// POST /api/profiles/analyze
export const analyzeProfile = async(req, res, next) => {
    try {
        const { username } = req.body;

        if (!username || !username.trim()) {
          return res.status(400).json({
            error: "Username is required",
          });
        }

        const data = await fetchGitHubProfile(username.trim().toLowerCase());

        //upsert into db
        await pool.query(
          `INSERT INTO profiles
            (username, name, bio, avatar_url, location, blog, company, twitter_username, public_repos, followers, following, total_stars, total_forks, top_languages, account_age_days, hireable)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                bio = VALUES(bio),
                avatar_url = VALUES(avatar_url),
                location = VALUES(location),
                blog = VALUES(blog),
                company = VALUES(company),
                twitter_username = VALUES(twitter_username),
                public_repos = VALUES(public_repos),
                followers = VALUES(followers),
                following = VALUES(following),
                total_stars = VALUES(total_stars),
                total_forks = VALUES(total_forks),
                top_languages = VALUES(top_languages),
                account_age_days = VALUES(account_age_days),
                hireable = VALUES(hireable),
                analyzed_at = NOW()
            `,
          [
            data.username,
            data.name,
            data.bio,
            data.avatar_url,
            data.location,
            data.blog,
            data.company,
            data.twitter_username,
            data.public_repos,
            data.followers,
            data.following,
            data.total_stars,
            data.total_forks,
            JSON.stringify(data.top_languages),
            data.account_age_days,
            data.hireable,
          ],
        );

        const [rows] = await pool.query("SELECT * FROM profiles WHERE username = ?", [data.username]);

        res.status(200).json({ success: true, profile: rows[0] });
    } catch (error) {
        if(error.response && error.response.status === 404) {
            return res.status(404).json({ error: "GitHub user not found" });
        }
        next(error);
    }
}


// GET /api/profiles
export const getAllProfiles = async(req,res,next) => {
    try {
        const [rows] = await pool.query("SELECT * FROM profiles ORDER BY analyzed_at DESC");
        res.status(200).json({ success: true,count: rows.length, profiles: rows });
    } catch (error) {
        next(error);
    }
}

// GET /api/profiles/:username
export const getProfileByUsername = async(req,res,next) => {
    try {
        const { username } = req.params;

        if (!username || !username.trim()) {
          return res.status(400).json({
            error: "Username is required",
          });
        }
        const [rows] = await pool.query("SELECT * FROM profiles WHERE username = ?", [username.trim().toLowerCase()]);
        if (rows.length === 0) {
            return res.status(404).json({
              success: false,
              error: "Profile not found in database.",
            });
        }
        res.status(200).json({ success: true, profile: rows[0] });
    } catch (error) {
        next(error);
    }
}