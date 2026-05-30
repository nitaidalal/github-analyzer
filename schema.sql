-- CREATE DATABASE IF NOT EXISTS github_analyzer;

-- USE github_analyzer;

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(200),
    blog VARCHAR(500),
    company VARCHAR(200),
    twitter_username VARCHAR(100),
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    top_languages JSON,
    account_age_days INT DEFAULT 0,
    hireable TINYINT(1),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);