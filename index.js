
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const userRoutes = require('./routes/users'); // Import the routes
const adminRoutes = require('./routes/admin');
const openaiRoutes = require('./routes/openai');

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
    app.use('/openai', openaiRoutes(database));

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
