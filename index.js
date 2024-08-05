// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');

// const app = express();
// const port = 3000;

// // MongoDB connection URI
// const uri = "mongodb+srv://hipo:hipo@hipo.ia7ctsa.mongodb.net/?retryWrites=true&w=majority&appName=HiPo";

// // Create a new MongoClient
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// async function main() {
//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const database = client.db('yourDatabaseName'); // replace with your database name
//     const usersCollection = database.collection('users'); // the users collection

//     // Endpoint to get data
//     app.get('/data', async (req, res) => {
//       try {
//         const data = await usersCollection.find({}).toArray();
//         res.status(200).json(data);
//       } catch (err) {
//         res.status(500).json({ message: 'Error fetching data', error: err });
//       }
//     });

//     // Endpoint to create a new user
//     app.post('/users', async (req, res) => {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//       }

//       try {
//         const newUser = { email, password };
//         const result = await usersCollection.insertOne(newUser);
//         res.status(201).json({ message: 'User created', userId: result.insertedId });
//       } catch (err) {
//         res.status(500).json({ message: 'Error creating user', error: err });
//       }
//     });

//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// main().catch(console.error);

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const userRoutes = require('./routes/users'); // Import the routes
const adminRoutes = require('./routes/admin');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb+srv://hipo:hipo@hipo.ia7ctsa.mongodb.net/?retryWrites=true&w=majority&appName=HiPo";

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');

    // Pass the database to the routes
    const database = client.db('Users'); // replace with your database name

    // Use the user routes and pass the database as a parameter
    app.use('/users', userRoutes(database));
    app.use('/admin', adminRoutes(database));

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
