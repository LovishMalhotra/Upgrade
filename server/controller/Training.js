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

router.get('/', async (req, res) => {
  try {
      const trainings = await Training.find()
          .populate('trainer', 'username email') // Populate trainer details
          .populate({
              path: 'participants.user', // This should match the schema correctly
              select: 'username email designation' // Specify the fields you want to fetch
          });
          // console.log(JSON.stringify(trainings, null, 2));

      res.status(200).json(trainings); // Send all training sessions as a JSON response
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching training sessions', error });
  }
});

router.put("/:trainingCode/participants/:participantId", async (req, res) => {
  try {
    const { trainingCode, participantId } = req.params;
    console.log(trainingCode);
    
    const {
      hackerRankScore,
      assessmentScore,
      performance,
      communication,
      remarks,
    } = req.body;

    // Find the training session by training_code
    const session = await Training.findOne({
      training_code: trainingCode,
    });

    if (!session) {
      return res.status(404).send("Training session not found");
    }

    // Find the specific participant using participantId
    const participant = session.participants.find(
      (p) => p._id.toString() === participantId // Check against participant's _id
    );

    if (!participant) {
      return res.status(404).send("Participant not found");
    }

    // Update participant scores
    participant.hackerRankScore = hackerRankScore;
    participant.assessmentScore = assessmentScore;
    participant.performance = performance;
    participant.communication = communication;
    participant.remarks = remarks;

    // Save the updated session
    await session.save();

    res.json({ message: "Participant updated successfully", participant });
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).send("Server error");
  }
});

router.get('/:training_code', async (req, res) => {
  const { training_code } = req.params;

  try {
      // Find the training session by training_code and populate participants
      const trainingSession = await Training.findOne({ training_code })
          .populate('participants.user', 'username email designation') // Populate user details
          .exec();

      if (!trainingSession) {
          return res.status(404).json({ message: 'Training session not found' });
      }

      res.status(200).json(trainingSession);
  } catch (error) {
      console.error('Error fetching training session:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/trainings/status', async (req, res) => {
  try {
    const trainings = await Training.find();
    
    if (!trainings.length) {
      return res.status(404).json({ message: "No training sessions found" });
    }

    const statusCounts = { completed: 0, pending: 0, ongoing: 0 };
    trainings.forEach(training => {
      if (statusCounts[training.status] !== undefined) {
        statusCounts[training.status] += 1;
      }
    });

    res.json(statusCounts);
  } catch (error) {
    res.status(500).send('Error fetching training sessions');
  }
});

router.get('/trainings/score-ranges', async (req, res) => {
  try {
    const trainings = await Training.find(); // Fetch all training sessions

    // Initialize the score range counts for each category
    const scoreRanges = {
      hackerRankScore: { '0-4': 0, '4-7': 0, '7-10': 0 },
      assessmentScore: { '0-4': 0, '4-7': 0, '7-10': 0 },
      performance: { '0-4': 0, '4-7': 0, '7-10': 0 },
      communication: { '0-4': 0, '4-7': 0, '7-10': 0 },
    };

    // Loop through trainings and participants to count scores in ranges
    trainings.forEach(training => {
      training.participants.forEach(participant => {
        ['hackerRankScore', 'assessmentScore', 'performance', 'communication'].forEach(scoreType => {
          const score = participant[scoreType];
          if (score <= 4) scoreRanges[scoreType]['0-4'] += 1;
          else if (score <= 7) scoreRanges[scoreType]['4-7'] += 1;
          else scoreRanges[scoreType]['7-10'] += 1;
        });
      });
    });

    res.json(scoreRanges); // Return the calculated score ranges
  } catch (error) {
    res.status(500).send('Error fetching score ranges');
  }
});


module.exports = router;
