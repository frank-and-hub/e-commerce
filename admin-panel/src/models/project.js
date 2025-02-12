const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, trim: true, unique: true, set: (value) => value.toLowerCase() },
    description: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['web', 'app', 'graphic'],
        required: true
    },
    status: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true
});

projectSchema.pre(/^find/, function (next) {
    this.where({ deleted_at: null });
    next();
});

projectSchema.index({ name: 1, deleted_at: 1 });

module.exports = mongoose.model('Project', projectSchema);
