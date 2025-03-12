const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    description: { type: String, required: false, trim: true },
    duration: { type: Number, required: true },
    period: {
        type: String,
        default: 'month',
        enum: ['day', 'week', 'month', 'year',],
        required: true
    },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

warrantySchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

warrantySchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Warranty', warrantySchema);