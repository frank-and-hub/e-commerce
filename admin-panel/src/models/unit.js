const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    short_name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

unitSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

unitSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Unit', unitSchema);