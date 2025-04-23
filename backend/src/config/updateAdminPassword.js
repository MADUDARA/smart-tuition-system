const bcrypt = require('bcryptjs');
const { pool } = require('./database');
require('dotenv').config();

const updateAdminPassword = async () => {
    try {
        // The password we want to set
        const newPassword = 'admin123';

        // Generate a new hash
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin user's password
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING email',
            [hashedPassword, 'admin@example.com']
        );

        if (result.rows.length > 0) {
            console.log('Admin password updated successfully');
            console.log('New password:', newPassword);
        } else {
            console.log('Admin user not found');
        }
    } catch (error) {
        console.error('Error updating admin password:', error);
    } finally {
        pool.end();
    }
};

updateAdminPassword(); 