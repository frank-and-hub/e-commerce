const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

designationSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

designationSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Designation', designationSchema);