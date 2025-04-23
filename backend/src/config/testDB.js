const { pool } = require('./database');
const logger = require('./logger');

const testDB = async () => {
    try {
        // Test database connection
        const result = await pool.query('SELECT NOW()');
        logger.info('Database connection successful', { timestamp: result.rows[0].now });

        // Test users table
        const usersResult = await pool.query('SELECT * FROM users');
        logger.info('Users table test successful', { userCount: usersResult.rows.length });

        // Test inserting a new user
        const insertResult = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            ['Test User', 'test@example.com', 'testpassword', 'student']
        );
        logger.info('Insert test successful', { user: insertResult.rows[0] });

        // Clean up test data
        await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
        logger.info('Test data cleaned up successfully');

    } catch (error) {
        logger.error('Database test failed', { error: error.message });
    } finally {
        // Close the pool
        await pool.end();
    }
};

// Run the test
testDB(); 