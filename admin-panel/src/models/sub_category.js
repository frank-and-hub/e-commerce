const mongoose = require('mongoose');
const { makeSlug } = require('@/utils/helper');

const SubCategorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    code: { type: String, required: true },
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    description: { type: String, required: false, trim: true },
    icon: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

SubCategorySchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

SubCategorySchema.pre('save', async function (next) {
    this.slug = makeSlug(this.name);
    next()
});

SubCategorySchema.index({ name: 1, category: 1, deleted_at: 1 });

module.exports = mongoose.model('SubCategory', SubCategorySchema);