const { body, validationResult } = require('express-validator');
const ErrorLog = require('../models/errorlog');

exports.validateUserSignUp = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6, max: 16 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .optional()
        .trim()
        .isMobilePhone().withMessage('Invalid phone number')
];

exports.validateUserSignin = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

exports.validate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();

        for (const error of errorArray) {
            const errorLog = new ErrorLog({
                route: req.originalUrl,
                statusCode: 422,
                errorMessage: error.msg,
                errorType: 'Validation Error',
                stackTrace: error.stack
            });
            await errorLog.save();
        }

        console.info('Errors logged successfully');
        return res.status(422).json({ errors: errorArray });
    }
    next();
}