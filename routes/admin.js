// const express = require('express');
// const router = express.Router();

// module.exports = (database) => {
//   const usersCollection = database.collection('users'); // the users collection

//   // Endpoint to get all users information
//   router.get('/all-users', async (req, res) => {
//     try {
//       const users = await usersCollection.find({}).toArray();
//       res.status(200).json(users);
//     } catch (err) {
//       res.status(500).json({ message: 'Error fetching users information', error: err });
//     }
//   });

//   return router;
// };
