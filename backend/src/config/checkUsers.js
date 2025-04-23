const { pool } = require('./database');
require('dotenv').config();

const checkUsers = async () => {
    try {
        console.log('Checking database connection...');

        // Test database connection
        const client = await pool.connect();
        console.log('Database connected successfully!');

        // Check if users table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('Users table does not exist!');
            return;
        }

        // Get all users
        const result = await client.query('SELECT id, name, email, role FROM users');

        console.log('\nUsers in database:');
        console.table(result.rows);

        // Release the client
        client.release();
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\nTroubleshooting steps:');
            console.log('1. Make sure PostgreSQL is running');
            console.log('2. Check your database credentials in .env file');
            console.log('3. Verify the database exists');
            console.log('4. Confirm PostgreSQL is running on the correct port');
        }
    } finally {
        await pool.end();
    }
};

checkUsers(); 