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
  try {
    const { image } = req.body;
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: 'pdf-generator'
    });
    res.json({ success: true, url: uploadedImage.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// Generate PDF endpoint
app.post('/generate-pdf', async (req, res) => {
  try {
    // Import fetch dynamically
    const fetch = await import('node-fetch');
    const { PDFDocument, rgb } = await import('pdf-lib');

    const { frontCoverUrl, frontCoverText, backCoverUrl, backCoverText, pages } = req.body;
    // Create new PDF document
    const pdfDoc = await PDFDocument.create();
    // Add front cover
    const frontCoverImage = await fetchImage(frontCoverUrl, pdfDoc); // Pass pdfDoc to fetchImage function
    const frontCoverPage = pdfDoc.addPage([600, 800]);
    frontCoverPage.drawImage(frontCoverImage, {
      x: 0,
      y: 0,
      width: 600,
      height: 800
    });
    // Add text to front cover
    frontCoverPage.drawText(frontCoverText, {
      x: 50,
      y: 750,
      size: 20,
      color: rgb(0, 0, 0)
    });
    // Add pages with content
    for (const page of pages) {
      const backgroundImage = await fetchImage(page.backgroundUrl, pdfDoc); // Pass pdfDoc to fetchImage function
      const newPage = pdfDoc.addPage([600, 800]);
      newPage.drawImage(backgroundImage, {
        x: 0,
        y: 0,
        width: 600,
        height: 800
      });
      newPage.drawText(page.text, {
        x: 50,
        y: 750,
        size: 20,
        color: rgb(0, 0, 0)
      });
      // Add more content as needed
    }
    // Add back cover
    const backCoverImage = await fetchImage(backCoverUrl, pdfDoc); // Pass pdfDoc to fetchImage function
    const backCoverPage = pdfDoc.addPage([600, 800]);
    backCoverPage.drawImage(backCoverImage, {
      x: 0,
      y: 0,
      width: 600,
      height: 800
    });
    // Add text to back cover
    backCoverPage.drawText(backCoverText, {
      x: 50,
      y: 750,
      size: 20,
      color: rgb(0, 0, 0)
    });
    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    // Send PDF to client
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating PDF' });
  }
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
