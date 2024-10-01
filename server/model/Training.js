const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    training_code: { type: String, required: true },
    status: { type: String, enum: ['completed', 'ongoing','pending'], required: true },
    // skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },  // Reference to the Skill model
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User who is the instructor
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },  // Duration in minutes
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}
, { timestamps: true });

module.exports = mongoose.model('Training', trainingSessionSchema);