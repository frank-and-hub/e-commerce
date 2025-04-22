const mongoose = require('mongoose');
const { makeSlug } = require('@/utils/helper');

const socialDetailSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    url: { type: String, default: null, trim: true },
    icon: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

socialDetailSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

socialDetailSchema.pre('save', async function (next) {
    this.slug = makeSlug(this.name);
    next()
});

socialDetailSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('SocialDetail', socialDetailSchema);