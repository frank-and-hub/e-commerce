const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Permission' }],
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

roleSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

roleSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Role', roleSchema);
