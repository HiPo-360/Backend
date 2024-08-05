// const express = require('express');
// const router = express.Router();

// module.exports = (database) => {
//   const usersCollection = database.collection('users'); // the users collection

//   // Endpoint to get data
//   router.get('/', async (req, res) => {
//     try {
//       const data = await usersCollection.find({}).toArray();
//       res.status(200).json(data);
//     } catch (err) {
//       res.status(500).json({ message: 'Error fetching data', error: err });
//     }
//   });

//   // Endpoint to create a new user
//   // Endpoint to create a new user
//   router.post('/', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//       const newUser = { email, password };
//       const result = await usersCollection.insertOne(newUser);
//       res.status(201).json({ message: 'User created', userId: result.insertedId });
//     } catch (err) {
//       res.status(500).json({ message: 'Error creating user', error: err });
//     }
//   });

//     router.post('/:id/onboarding', async (req, res) => {
//     const { id } = req.params;
//     const { role, experience, location, desire, career } = req.body;

//     if (!role || !experience || !location || !desire || !career) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//       const updateUser = {
//         role,
//         experience,
//         location,
//         desire,
//         career
//       };

//       const result = await usersCollection.updateOne(
//         { _id: new MongoClient.ObjectID(id) },
//         { $set: updateUser }
//       );

//       if (result.matchedCount === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json({ message: 'Onboarding data updated' });
//     } catch (err) {
//       res.status(500).json({ message: 'Error updating onboarding data', error: err });
//     }
//   });


//   return router;
// };

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

  // Endpoint to create a new user
  router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
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

  return router;
};
