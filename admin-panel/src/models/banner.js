const mongoose = require('mongoose');
const { makeSlug } = require('../utils/helper');

const bannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    title: { type: String, default: null, trim: true },
    url: { type: String, default: null, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

bannerSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

bannerSchema.pre('save', async function (next) {
    this.slug = makeSlug(this.name);
    next()
});

bannerSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Banner', bannerSchema);