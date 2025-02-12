const config = require('../../nodemon.json').env;
const ErrorLog = require('../models/errorlog');

module.exports = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorType = config.ERROR_CODES[statusCode] || 'UnknownError';

    const errorLog = new ErrorLog({
        route: req.originalUrl,
        statusCode: statusCode,
        errorMessage: err.message,
        errorType: errorType,
        stackTrace: err.stack
    });

    errorLog.save()
        .then(() => {
            console.info('Error logged successfully');
        })
        .catch(logError => {
            console.error('Failed to log error:', logError);
        });

    res.status(statusCode).json({
        code: statusCode,
        message: err.message || 'An error occurred',
        errorType: errorType,
        line: err.line
    });
}
