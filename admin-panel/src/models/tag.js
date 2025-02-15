const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, set: (value) => value.toLowerCase() },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

tagSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

tagSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Tag', tagSchema);