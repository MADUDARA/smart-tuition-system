const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const backupDB = require('./config/backupDB');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Error:', { error: err.message });
    res.status(500).json({ error: 'Internal Server Error' });
});

// Run database backup and start server
const startServer = async () => {
    try {
        // Run backup before starting server
        await backupDB();

        // Try different ports if 5000 is in use
        const ports = [5000, 5001, 5002, 5003, 5004];

        for (const port of ports) {
            try {
                await new Promise((resolve, reject) => {
                    const server = app.listen(port, () => {
                        logger.info(`Server running on port ${port}`);
                        resolve();
                    });

                    server.on('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            logger.warn(`Port ${port} is in use, trying next port`);
                            reject(err);
                        } else {
                            logger.error('Server error:', { error: err.message });
                            reject(err);
                        }
                    });
                });

                // If we get here, the server started successfully
                break;
            } catch (err) {
                if (port === ports[ports.length - 1]) {
                    throw new Error('All ports are in use');
                }
                // Continue to next port
                continue;
            }
        }
    } catch (error) {
        logger.error('Failed to start server:', { error: error.message });
        process.exit(1);
    }
};

// Start the server
startServer(); 