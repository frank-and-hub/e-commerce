const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    currency: { type: String, required: true, trim: true },
    payment_method: { type: String, enum: ['offline', 'online'], default: 'online' },
    payment_type: { type: String, enum: ['hour', 'day', 'week', 'month', 'year'], default: 'month' },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

planSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

planSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Plan', planSchema);
