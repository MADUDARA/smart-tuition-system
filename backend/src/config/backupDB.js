const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
require('dotenv').config();

const backupDB = () => {
    try {
        // Verify environment variables
        const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(__dirname, '../../backups');
        const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

        // Create backups directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Set PGPASSWORD environment variable
        process.env.PGPASSWORD = process.env.DB_PASSWORD;

        // Find pg_dump executable
        const pgDumpPath = process.env.PG_BIN_PATH || 'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe';

        if (!fs.existsSync(pgDumpPath)) {
            throw new Error(`pg_dump not found at: ${pgDumpPath}`);
        }

        // Construct the pg_dump command with proper escaping for Windows
        const command = `"${pgDumpPath}" -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -F p -f "${backupFile}"`;

        logger.info('Starting database backup...', {
            backupFile,
            pgDumpPath,
            dbConfig: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            }
        });

        return new Promise((resolve, reject) => {
            const child = exec(command, (error, stdout, stderr) => {
                // Clear the password from environment
                delete process.env.PGPASSWORD;

                if (error) {
                    logger.error('Backup failed:', {
                        error: error.message,
                        code: error.code,
                        signal: error.signal,
                        stderr: stderr
                    });
                    reject(error);
                    return;
                }

                if (stderr) {
                    logger.warn('Backup warnings:', { stderr });
                }

                logger.info('Backup completed successfully', { backupFile });
                resolve(backupFile);
            });

            // Handle process events
            child.on('error', (error) => {
                logger.error('Backup process error:', { error: error.message });
                reject(error);
            });

            child.on('exit', (code, signal) => {
                if (code !== 0) {
                    logger.error('Backup process exited with error:', { code, signal });
                }
            });
        });

    } catch (error) {
        logger.error('Backup initialization failed:', { error: error.message });
        throw error;
    }
};

module.exports = backupDB; 