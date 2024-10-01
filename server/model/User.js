const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin','trainer', 'user'], default: 'user', required:'true' },
    designation:{type: String}
});

module.exports = mongoose.model('User', userSchema);