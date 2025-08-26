const express = require('express');
const multer = require('multer');
const cors = require('cors');
 const fs = require('fs');
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = 3000;

// Enable CORS
app.use(bodyParser.json());
app.use(cors());

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Gemini API endpoint
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Read file content (assuming text for MVP)
    const fileContent = fs.readFileSync(filePath, 'utf8');

   // Prepare request to Gemini
    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert this document into professional slides:\n\n${fileContent}`
              }
            ]
          }
        ]
      }),
    });

  // Get AI output
     const data = await response.json();

    // Extract AI output
    const slidesText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";


    // Delete file after processing
    fs.unlinkSync(filePath);

  res.json({
      message: "File processed successfully",
      slides: slidesText,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
