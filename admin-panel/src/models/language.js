const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const { makeSlug } = require('@/utils/helper');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const languageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    dial_code: { type: String, default: null, minlength: 2, maxlength: 10 },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

languageSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

languageSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('User', languageSchema);
