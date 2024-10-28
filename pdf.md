To create an endpoint in your Express router that accepts multiple PDFs, along with their names and dates, you can modify your code as follows. This new endpoint will handle an array of objects containing the PDF details.

Here’s how you can do it:

### Adding the New Endpoint

```javascript
// Endpoint for uploading multiple PDFs
router.post('/:id/upload-pdfs', async (req, res) => {
  const { id } = req.params;
  const { pdfs } = req.body; // Expecting an array of { pdfName, pdfDate, pdfFile }

  // Check if pdfs array is present and has at least one entry
  if (!Array.isArray(pdfs) || pdfs.length === 0) {
    return res.status(400).json({ message: 'At least one PDF entry is required' });
  }

  // Validate each PDF entry
  for (const pdf of pdfs) {
    const { pdfName, pdfDate, pdfFile } = pdf;
    if (!pdfName || !pdfDate || !pdfFile) {
      return res.status(400).json({ message: 'All fields (pdfName, pdfDate, pdfFile) are required for each PDF' });
    }
  }

  try {
    const pdfData = pdfs.map(({ pdfName, pdfDate, pdfFile }) => ({
      pdfName,
      pdfDate,
      pdfFile
    }));

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
```

### Explanation of the Code

1. **Endpoint Definition**: 
   - The endpoint is defined with `/:id/upload-pdfs`, which captures the user ID from the URL.

2. **Request Body**: 
   - The request body expects an array of objects named `pdfs`. Each object should contain `pdfName`, `pdfDate`, and `pdfFile`.

3. **Validation**:
   - It checks if the `pdfs` array is present and has entries. It also validates that each entry contains the required fields.

4. **Data Processing**:
   - It maps over the `pdfs` array to structure the data before saving it to the database.

5. **Database Update**:
   - The code attempts to update the user document with the new `pdfs` array.

6. **Error Handling**:
   - It handles potential errors, such as the user not being found or issues during the database update.

### Usage

To use this endpoint, send a POST request to `/:id/upload-pdfs` with a JSON body structured like this:

```json
{
  "pdfs": [
    {
      "pdfName": "Document 1",
      "pdfDate": "2024-10-01",
      "pdfFile": "base64EncodedStringOrFilePath"
    },
    {
      "pdfName": "Document 2",
      "pdfDate": "2024-10-02",
      "pdfFile": "base64EncodedStringOrFilePath"
    }
  ]
}
```

### Notes

- Make sure to replace `"base64EncodedStringOrFilePath"` with the actual PDF data or a path depending on how you handle file uploads.
- You may also want to consider how you're storing or referencing the PDF files (e.g., cloud storage) if you're not storing them directly in your database.