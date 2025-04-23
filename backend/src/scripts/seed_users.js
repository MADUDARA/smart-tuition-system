const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function seedUsers() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'add_sample_user.sql'), 'utf8');
        await pool.query(sql);
        console.log('Sample users added successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        pool.end();
    }
}

seedUsers(); 