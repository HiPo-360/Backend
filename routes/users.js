
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

module.exports = (database) => {
  const usersCollection = database.collection('users'); // the users collection


router.get('/', (req, res) => {
  res.send('thes the api user route');
});

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
  const { username, country, whatLooking, industry, functionInCompany, currentRole, experience, profilePic } = req.body;

  // Check if all required fields are present
  if (!username || !country || !whatLooking || !industry || !functionInCompany || !currentRole || !experience || !profilePic) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const onboardingData = {
      username,
      country,
      whatLooking,
      industry,
      functionInCompany,
      currentRole,
      experience,
      profilePic
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


// router.post('/:id/upload-pdfs', async (req, res) => {
//   const { id } = req.params;
//   const { pdfs } = req.body; // Expecting an array of { pdfName, pdfDate, pdfFile }

//   // Check if pdfs array is present and has at least one entry
//   if (!Array.isArray(pdfs) || pdfs.length === 0) {
//     return res.status(400).json({ message: 'At least one PDF entry is required' });
//   }

//   // Validate each PDF entry
//   for (const pdf of pdfs) {
//     const { pdfName, pdfDate, pdfFile } = pdf;
//     if (!pdfName || !pdfDate || !pdfFile) {
//       return res.status(400).json({ message: 'All fields (pdfName, pdfDate, pdfFile) are required for each PDF' });
//     }
//   }

//   try {
//     const pdfData = pdfs.map(({ pdfName, pdfDate, pdfFile }) => ({
//       pdfName,
//       pdfDate,
//       pdfFile
//     }));

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { pdfs: pdfData } } // Save the array of PDFs
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'PDFs uploaded successfully' });
//   } catch (err) {
//     console.error('Error uploading PDFs:', err);
//     res.status(500).json({ message: 'Error uploading PDFs', error: err });
//   }
// });




router.post('/:id/upload-pdfs', async (req, res) => {
  const { id } = req.params;
  const { pdfs } = req.body; // Expecting an array of { pdfName, pdfDate, pdfFile }

  // Check if pdfs array is present and has at least one entry
  if (!Array.isArray(pdfs) || pdfs.length === 0) {
    return res.status(400).json({ message: 'At least one PDF entry is required' });
  }

  // Split the concatenated strings by commas and validate each PDF entry
  const pdfData = [];
  for (const pdf of pdfs) {
    const { pdfName, pdfDate, pdfFile } = pdf;

    // Split the concatenated strings
    const pdfNames = pdfName.split(',').map(name => name.trim());
    const pdfDates = pdfDate.split(',').map(date => date.trim());
    const pdfFiles = pdfFile.split(',').map(file => file.trim());

    // Ensure lengths of all arrays are the same
    if (pdfNames.length !== pdfDates.length || pdfNames.length !== pdfFiles.length) {
      return res.status(400).json({ message: 'Mismatch in number of pdfName, pdfDate, and pdfFile entries' });
    }

    // Validate and add each entry
    for (let i = 0; i < pdfNames.length; i++) {
      if (!pdfNames[i] || !pdfDates[i] || !pdfFiles[i]) {
        return res.status(400).json({ message: 'All fields (pdfName, pdfDate, pdfFile) are required for each PDF' });
      }

      // Check for duplicate PDF files
      if (pdfData.some(pdfEntry => pdfEntry.pdfFile === pdfFiles[i])) {
        return res.status(400).json({ message: `Duplicate PDF file detected: ${pdfFiles[i]}` });
      }

      pdfData.push({
        pdfName: pdfNames[i],
        pdfDate: pdfDates[i],
        pdfFile: pdfFiles[i]
      });
    }
  }

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { pdfs: pdfData } } // Save the array of PDFs
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'PDFs uploaded successfully' });
  } catch (err) {
    console.error('Error uploading PDFs:', err);
    res.status(500).json({ message: 'Error uploading PDFs', error: err });
  }
});






  // Endpoint for onboarding questions
  router.post('/:id/onboardingQuestions', async (req, res) => {
    const { id } = req.params;
    const { q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;

    if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8) {
      return res.status(400).json({ message: 'All questions are required' });
    }

    try {
      const questionsData = {
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
        { $set: { questions: questionsData } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Onboarding questions updated' });
    } catch (err) {
      console.error('Error updating onboarding questions:', err);
      res.status(500).json({ message: 'Error updating onboarding questions', error: err });
    }
  });

// Endpoint to get all onboarding questions for a specific user
router.get('/:id/onboardingQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { projection: { questions: 1 } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching onboarding questions', error: err });
  }
});


  return router;
};
