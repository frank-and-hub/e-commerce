const multer = require('multer');
const path = require('path');

const transporter = require('../config/email');
const secrets = require('../config/secrets');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/file/');
    },
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        const fileName = new Date().toISOString().replace(/:/g, '-') + ext;
        callback(null, fileName);
    }
});

const fileFilter = (allowedTypes) => (req, file, callback) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return callback(null, true);
    } else {
        callback(new Error('Invalid file type'), false);
    }
}

const fileImageFilter = fileFilter(/jpeg|jpg|png|pdf|svg|webp|jfif|pjpeg|pjp/);
const genericFileFilter = fileFilter(/pdf|png|pot|potm|ods|doc|docx|odt|xls|xlsx|ppt|pttx|txt|xml|pem/);

const fileLimit = { fileSize: 5 * 1024 * 1024 } // 50mb limit

const fileImageUpload = multer({
    storage: storage,
    limits: fileLimit,
    fileFilter: fileImageFilter
});

const fileUpload = multer({
    storage: storage,
    limits: fileLimit,
    fileFilter: genericFileFilter
});

const updateOps = (data) => {
    const array_data = data.body;
    const auth_user = data.userData.id;
    const update_ops = {}
    for (const ops of array_data) {
        update_ops[ops.propName] = ops.value;
    }
    update_ops['updated_by'] = auth_user;
    return update_ops;
}

const requestTime = (req, res, next) => {
    req.requestTime = Date.now()
    next()
}

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: secrets.emailUser,
            to,
            subject,
            text
        });
        console.info('Email sent successfully');
    } catch (err) {
        console.info('Error sending email:', err.message);
    }
}

const filterData = async (item) => {
    return item.map(per => (
        per._id
    ));
}

module.exports = { fileUpload, fileImageUpload, updateOps, requestTime, sendEmail, filterData }
