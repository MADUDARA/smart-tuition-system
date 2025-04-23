const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Validate input
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findByEmail(email);
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        console.log('Comparing password...');
        const isPasswordValid = await User.comparePassword(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Password comparison failed');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Return user data and token
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login
}; 