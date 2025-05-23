const mongoose = require('mongoose');
const { makeSlug } = require('@/utils/helper');

const departmentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    icon: { type: String, required: true },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }],
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

departmentSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

departmentSchema.pre('save', async function (next) {
    this.slug = makeSlug(this.name);
    next()
});

departmentSchema.index({ cart: 1, user: 1, deleted_at: 1 });

module.exports = mongoose.model('Department', departmentSchema);