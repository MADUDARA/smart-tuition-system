const { pool } = require('./database');
const bcrypt = require('bcryptjs');

const recreateDB = async () => {
    try {
        // Drop the existing users table if it exists
        await pool.query('DROP TABLE IF EXISTS users CASCADE');

        // Create users table
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('superAdmin', 'subAdmin', 'teachersAdmin', 'teacher', 'student')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create index on email for faster lookups
        await pool.query(`
            CREATE INDEX idx_users_email ON users(email);
        `);

        // Hash passwords for test users
        const superAdminPassword = await bcrypt.hash('superadmin123', 10);
        const subAdminPassword = await bcrypt.hash('subadmin123', 10);
        const teachersAdminPassword = await bcrypt.hash('teachersadmin123', 10);
        const teacherPassword = await bcrypt.hash('teacher123', 10);
        const studentPassword = await bcrypt.hash('student123', 10);

        // Insert test users for all roles
        await pool.query(`
            INSERT INTO users (name, email, password, role) VALUES
            ('Super Admin', 'superadmin@example.com', $1, 'superAdmin'),
            ('Sub Admin', 'subadmin@example.com', $2, 'subAdmin'),
            ('Teachers Admin', 'teachersadmin@example.com', $3, 'teachersAdmin'),
            ('Teacher', 'teacher@example.com', $4, 'teacher'),
            ('Student', 'student@example.com', $5, 'student')
        `, [
            superAdminPassword,
            subAdminPassword,
            teachersAdminPassword,
            teacherPassword,
            studentPassword
        ]);

        console.log('Database recreated successfully with test users for all roles');
        console.log('\nTest User Credentials:');
        console.log('1. Super Admin: superadmin@example.com / superadmin123');
        console.log('2. Sub Admin: subadmin@example.com / subadmin123');
        console.log('3. Teachers Admin: teachersadmin@example.com / teachersadmin123');
        console.log('4. Teacher: teacher@example.com / teacher123');
        console.log('5. Student: student@example.com / student123');
    } catch (error) {
        console.error('Error recreating database:', error);
    } finally {
        pool.end();
    }
};

recreateDB(); 