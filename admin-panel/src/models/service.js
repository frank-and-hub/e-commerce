const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

serviceSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

serviceSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Service', serviceSchema);