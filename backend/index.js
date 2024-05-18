const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 5173;

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dznkgwue4',
    api_key: '336181179726171',
    api_secret: 'Vvw8AVqCrAKHX-TuyAsYigARi_E'
});

// Middleware
app.use(bodyParser.json());

// Upload endpoint for images
app.post('/upload', async (req, res) => {
 
});

// Generate PDF endpoint
app.post('/generate-pdf', async (req, res) => {
  
});

// Function to fetch image from Cloudinary
async function fetchImage(url, pdfDoc) { // Pass pdfDoc as a parameter
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await pdfDoc.embedPng(arrayBuffer);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
