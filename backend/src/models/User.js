const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

class User {
    static async create({ name, email, password, role }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
                [name, email, hashedPassword, role]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = User; 