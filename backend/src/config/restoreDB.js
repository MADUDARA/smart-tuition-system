const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const restoreDB = (backupFile) => {
    if (!fs.existsSync(backupFile)) {
        logger.error('Backup file not found', { backupFile });
        return;
    }

    // Construct the psql command
    const command = `psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f "${backupFile}"`;

    logger.info('Starting database restore...', { backupFile });

    exec(command, (error, stdout, stderr) => {
        if (error) {
            logger.error('Restore failed:', { error: error.message });
            return;
        }
        if (stderr) {
            logger.warn('Restore warnings:', { stderr });
        }
        logger.info('Restore completed successfully', { backupFile });
    });
};

module.exports = restoreDB; 