
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
 // Function to split dates safely
  const splitDatesSafely = (dates) => {
    const dateRegex = /\w{3} \d{1,2}, \d{4} \d{1,2}:\d{2} (am|pm)/g;
    return dates.match(dateRegex) || [];
  };
  // Split the concatenated strings by commas and validate each PDF entry
  const pdfData = [];
  for (const pdf of pdfs) {
    const { pdfName, pdfDate, pdfFile } = pdf;
    console.log('Original pdfName:', pdfName);
    console.log('Original pdfDate:', pdfDate);
    console.log('Original pdfFile:', pdfFile);

    // Split the concatenated strings
    const pdfNames = pdfName.split(',').map(name => name.trim());
    const pdfDates = splitDatesSafely(pdfDate);
    const pdfFiles = pdfFile.split(',').map(file => file.trim());

    console.log('Splitted pdfNames:', pdfNames);
    console.log('Splitted pdfDates:', pdfDates);
    console.log('Splitted pdfFiles:', pdfFiles);
    console.log('Splitted pdfNames:', pdfNames.length);
    console.log('Splitted pdfDates:', pdfDates.length);
    console.log('Splitted pdfFiles:', pdfFiles.length);
    // Ensure lengths of all arrays are the same
    if (pdfNames.length !== pdfDates.length || pdfNames.length !== pdfFiles.length) {
      return res.status(400).json({ message: 'Mismatch in number of pdfName, pdfDate, and pdfFile entries' });
    }

    // Validate and add each entry
    for (let i = 0; i < pdfNames.length; i++) {
      if (!pdfNames[i] || !pdfDates[i] || !pdfFiles[i]) {
        return res.status(400).json({ message: 'All fields (pdfName, pdfDate, pdfFile) are required for each PDF' });
      }

      // Ensure no duplicate PDF files
      if (pdfData.some(pdfEntry => pdfEntry.pdfFile === pdfFiles[i])) {
        continue; // Skip duplicate PDF files
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


 
      // Check for duplicate PDF files
      // if (pdfData.some(pdfEntry => pdfEntry.pdfFile === pdfFiles[i])) {
      //   return res.status(400).json({ message: `Duplicate PDF file detected: ${pdfFiles[i]}` });
      // }
 




// POST endpoint for self-survey questions
router.post('/:id/selfSurveyQuestions', async (req, res) => {
  const { id } = req.params;
  const { q1,q1B, q2, q3, q4, q5, q6, q7, q8,q9 } = req.body;

  // Check if all questions are provided
  if (!q1 || !q1B || !q2 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8 ||!q9) {
    return res.status(400).json({ message: 'All questions are required' });
  }

  try {
    // Prepare questions data
    const questionsData = {
     
      q1,
      q1B,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
      q8,
      q9,
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { selfSurveyQuestions: questionsData } } // Changed to selfSurveyQuestions
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Self-survey questions updated' });
  } catch (err) {
    console.error('Error updating self-survey questions:', err);
    res.status(500).json({ message: 'Error updating self-survey questions', error: err });
  }
});

// GET endpoint for self-survey questions
router.get('/:id/selfSurveyQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { projection: { selfSurveyQuestions: 1 } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.selfSurveyQuestions);
  } catch (err) {
    console.error('Error retrieving self-survey questions:', err);
    res.status(500).json({ message: 'Error retrieving self-survey questions', error: err });
  }
});


// POST endpoint for family and friends survey questions
router.post('/:id/familyFriendsQuestions', async (req, res) => {
  const { id } = req.params;
  const { q1, q2, q3, q4, q5, q6, q7 } = req.body;

  // Check if all questions are provided
  if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7) {
    return res.status(400).json({ message: 'All questions are required' });
  }

  try {
    // Prepare questions data
    const questionsData = {
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { familyFriendsQuestions: questionsData } } // Updated to familyFriendsQuestions
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Family and friends survey questions updated' });
  } catch (err) {
    console.error('Error updating family and friends survey questions:', err);
    res.status(500).json({ message: 'Error updating family and friends survey questions', error: err });
  }
});

// GET endpoint for family and friends survey questions
router.get('/:id/familyFriendsQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { familyFriendsQuestions: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.familyFriendsQuestions);
  } catch (err) {
    console.error('Error retrieving family and friends survey questions:', err);
    res.status(500).json({ message: 'Error retrieving family and friends survey questions', error: err });
  }
});

 // POST endpoint for manager survey questions
router.post('/:id/managerQuestions', async (req, res) => {
  const { id } = req.params;
  const { q1, q2, q3, q4, q5, q6, q7, q8, q9 } = req.body;

  // Check if all questions are provided
  if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7 || !q8 || !q9) {
    return res.status(400).json({ message: 'All questions are required' });
  }

  try {
    // Prepare questions data
    const questionsData = {
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
      q8,
      q9,
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { managerQuestions: questionsData } } // Updated to managerQuestions
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Manager survey questions updated' });
  } catch (err) {
    console.error('Error updating manager survey questions:', err);
    res.status(500).json({ message: 'Error updating manager survey questions', error: err });
  }
});

// GET endpoint for manager survey questions
router.get('/:id/managerQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { managerQuestions: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.managerQuestions);
  } catch (err) {
    console.error('Error retrieving manager survey questions:', err);
    res.status(500).json({ message: 'Error retrieving manager survey questions', error: err });
  }
});


// POST endpoint for reportees survey questions
router.post('/:id/reporteesQuestions', async (req, res) => {
  const { id } = req.params;
  const { q1, q2, q3, q4, q5, q6, q7 } = req.body;

  // Check if all questions are provided
  if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7) {
    return res.status(400).json({ message: 'All questions are required' });
  }

  try {
    // Prepare questions data
    const questionsData = {
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { reporteesQuestions: questionsData } } // Updated to reporteesQuestions
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Reportees survey questions updated' });
  } catch (err) {
    console.error('Error updating reportees survey questions:', err);
    res.status(500).json({ message: 'Error updating reportees survey questions', error: err });
  }
});

// GET endpoint for reportees survey questions
router.get('/:id/reporteesQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { reporteesQuestions: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.reporteesQuestions);
  } catch (err) {
    console.error('Error retrieving reportees survey questions:', err);
    res.status(500).json({ message: 'Error retrieving reportees survey questions', error: err });
  }
});


// POST endpoint for reportees survey questions
router.post('/:id/colleaguesQuestions' , async (req, res) => {
  const { id } = req.params;
  const { q1, q2, q3, q4, q5, q6, q7 } = req.body;

  // Check if all questions are provided
  if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6 || !q7) {
    return res.status(400).json({ message: 'All questions are required' });
  }

  try {
    // Prepare questions data
    const questionsData = {
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
    };

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { colleaguesQuestions: questionsData } } // Updated to vcolleaguesQuestions
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Reportees survey questions updated' });
  } catch (err) {
    console.error('Error updating reportees survey questions:', err);
    res.status(500).json({ message: 'Error updating reportees survey questions', error: err });
  }
});

// GET endpoint for reportees survey questions
router.get('/:id/colleaguesQuestions', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { colleaguesQuestions: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.colleaguesQuestions);
  } catch (err) {
    console.error('Error retrieving colleagues survey questions:', err);
    res.status(500).json({ message: 'Error retrieving colleagues survey questions', error: err });
  }
});



  return router;
};
