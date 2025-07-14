const winston = require('winston');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const dateFormat = () => {
    return new Date().toISOString();
};

class LoggerService {
    constructor(route) {
        this.route = route;

        // Build the full log path: 'log/logerror/<route>.log'
        const logDirectory = path.join(process.env.LOGFILEPATH || 'log/logerror');
        const logFilePath = path.join(logDirectory, `${route}.log`);

        // Ensure the log directory exists
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp, ...meta }) => {
                    let logMessage = `${dateFormat()} | ${level.toUpperCase()} | ${message}`;
                    if (Object.keys(meta).length) {
                        logMessage += ` | Data: ${JSON.stringify(meta)}`;
                    }
                    return logMessage;
                })
            ),
            transports: [
                new winston.transports.File({
                    filename: logFilePath,
                }),
            ],
        });
    }

    log(level, message, obj = null) {
        if (obj) {
            this.logger.log(level, message, obj);
        } else {
            this.logger.log(level, message);
        }
    }

    info(message, obj = null) {
        this.log('info', message, obj);
    }

    error(message, obj = null) {
        this.log('error', message, obj);
    }

    debug(message, obj = null) {
        this.log('debug', message, obj);
    }
    handleError(context, error) {
        this.error(`Error in ${context}`, { error: error.message, stack: error.stack });
    }
}

module.exports = LoggerService;
