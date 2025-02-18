const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    percentage: { type: Number, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

discountSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

discountSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Discount', discountSchema);
