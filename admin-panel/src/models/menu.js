const mongoose = require('mongoose');
const { makeSlug } = require('@/utils/helper');

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    route: { type: String, default: null, trim: true, },
    type: { type: Boolean, default: true },
    icon: { type: String, required: null },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null, required: false },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

menuSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

menuSchema.pre('save', async function (next) {
    this.slug = makeSlug(this.name);
    next()
});

menuSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Menu', menuSchema);
