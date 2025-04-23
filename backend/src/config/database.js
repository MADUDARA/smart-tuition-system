const { Pool } = require('pg');
require('dotenv').config();
const logger = require('./logger');

// Simple connection test without JSON logging
logger.info('Connecting to database...');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    // Add connection timeout
    connectionTimeoutMillis: 5000,
    // Add retry logic
    max: 20,
    idleTimeoutMillis: 30000,
});

// Test the connection with better error handling
pool.connect((err, client, release) => {
    if (err) {
        logger.error('Database connection error:', { error: err.message });
        return;
    }

    logger.info('Successfully connected to PostgreSQL database');

    // Test a simple query
    client.query('SELECT version()', (err, result) => {
        release();
        if (err) {
            logger.error('Query error:', { error: err.message });
        } else {
            logger.info('PostgreSQL version:', { version: result.rows[0].version });
        }
    });
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 