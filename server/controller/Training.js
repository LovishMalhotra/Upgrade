const express = require('express');
const Training = require('../model/Training'); // Adjust the path as needed
const router = express.Router();

// Add Training Session
router.post('/', async (req, res) => {
  try {
    const trainingData = req.body; // Get data from request body
    const newTraining = new Training(trainingData);
    await newTraining.save();
    res.status(201).json({ message: 'Training session added successfully!', training: newTraining });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding training session', error });
  }
});

module.exports = router;
