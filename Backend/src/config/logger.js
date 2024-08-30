const { createLogger, format, transports } = require("winston");
const { printf, timestamp, combine } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

//custom log formate
const customLogger = printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
});

//creating logger
const logger = createLogger({
    level : 'info', //default level info
    format : combine(
        timestamp(), // adding timestamp to log
        customLogger //our custom log formate
    ),
    transports : [ //where to log, e.g - console, file...
        new transports.Console({
            format : format.combine(
                format.colorize(), // Colorize output
                format.simple() // Use simple format
            )
        }),
        new DailyRotateFile({
            filename : 'logs/%DATE%.log', //setted the filename as date
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m', // Rotate logs if they exceed 20MB
            maxFiles: '14d' // Keep logs for 14 days
        })
    ]
});

module.exports = logger;