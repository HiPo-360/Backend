
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

module.exports = (database) => {
  const usersCollection = database.collection('users'); // the users collection

  // Endpoint to get all users
  router.get('/', async (req, res) => {
    try {
      const data = await usersCollection.find({}).toArray();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  });

    router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(200).json({ message: 'User already exists', userId: existingUser._id });
      }

      // Create a new user if not found
      const newUser = { email, password };
      const result = await usersCollection.insertOne(newUser);
      res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error creating user', error: err });
    }
  });
  // Endpoint for onboarding data
  router.post('/:id/onboarding', async (req, res) => {
    const { id } = req.params;
    const { role, experience, location, desire, career } = req.body;

    if (!role || !experience || !location || !desire || !career) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const onboardingData = {
        role,
        experience,
        location,
        desire,
        career
      };

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { onboarding: onboardingData } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Onboarding data updated' });
    } catch (err) {
      console.error('Error updating onboarding data:', err);
      res.status(500).json({ message: 'Error updating onboarding data', error: err });
    }
  });



// // Endpoint for answering onboarding questions
//   router.post('/:id/onboarding/:questionNumber', async (req, res) => {
//     const { id, questionNumber } = req.params;
//     const { answer } = req.body;

//     if (!answer) {
//       return res.status(400).json({ message: 'Answer is required' });
//     }

//     if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > 10) {
//       return res.status(400).json({ message: 'Invalid question number' });
//     }

//     try {
//       const result = await usersCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { [`onboarding.question${questionNumber}`]: answer } }
//       );

//       if (result.matchedCount === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json({ message: `Answer for question ${questionNumber} updated` });
//     } catch (err) {
//       console.error(`Error updating answer for question ${questionNumber}:`, err);
//       res.status(500).json({ message: `Error updating answer for question ${questionNumber}`, error: err });
//     }
//   });

 // Endpoint for onboarding data with multiple questions
  router.post('/:id/onboardingQuestions', async (req, res) => {
    const { id } = req.params;
    const { q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;

    if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8 ) {
      return res.status(400).json({ message: 'All questions are required' });
    }

    try {
      const onboardingData = {
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7,
        q8,
      };

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { onboarding: onboardingData } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Onboarding data updated' });
    } catch (err) {
      console.error('Error updating onboarding data:', err);
      res.status(500).json({ message: 'Error updating onboarding data', error: err });
    }
  });





  return router;
};
