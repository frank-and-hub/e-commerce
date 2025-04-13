const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    color: { type: String, required: false },
    background: { type: String, required: false },
    theme: { type: String, enum: ['dark', 'light'], default: 'light' },
    grayscale: { type: Boolean, default: false },
    grayscale_percentage: { type: String, default: '1', required: false },
    invert: { type: Boolean, default: false },
    invert_percentage: { type: String, default: '1', required: false },
    saturate: { type: Boolean, default: false },
    saturate_percentage: { type: String, default: '1', required: false },
    contrast: { type: Boolean, default: false },
    contrast_percentage: { type: String, default: '1', required: false },
    sepia: { type: Boolean, default: false },
    sepia_percentage: { type: String, default: '1', required: false },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

settingSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

settingSchema.index({ deleted_at: 1 });

module.exports = mongoose.model('Setting', settingSchema);