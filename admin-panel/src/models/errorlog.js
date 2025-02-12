const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    route: { type: String, required: true },
    errorType: { type: String },
    statusCode: { type: Number, required: true },
    errorMessage: { type: String, required: true },
    stackTrace: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
