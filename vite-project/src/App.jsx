import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [frontCover, setFrontCover] = useState('');
  const [backCover, setBackCover] = useState('');
  const [frontCoverText, setFrontCoverText] = useState('');
  const [backCoverText, setBackCoverText] = useState('');
  const [pages, setPages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFrontCoverUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('/upload', formData);
      setFrontCover(response.data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackCoverUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('/upload', formData);
      setBackCover(response.data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageAdd = () => {
    setPages([...pages, { text: '', backgroundUrl: '' }]);
  };

  const handlePageTextChange = (index, newText) => {
    const updatedPages = [...pages];
    updatedPages[index].text = newText;
    setPages(updatedPages);
  };

  const handlePageImageUpload = async (index, e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('/upload', formData);
      const updatedPages = [...pages];
      updatedPages[index].backgroundUrl = response.data.url;
      setPages(updatedPages);
    } catch (error) {
      console.error(error);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await axios.post('/generate-pdf', {
        frontCoverUrl: frontCover,
        frontCoverText: frontCoverText,
        backCoverUrl: backCover,
        backCoverText: backCoverText,
        pages
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>PDF Generator</h1>
      <h2>Front Cover</h2>
      <input type="file" accept="image/*" onChange={handleFrontCoverUpload} />
      <input
        type="text"
        value={frontCoverText}
        onChange={(e) => setFrontCoverText(e.target.value)}
        placeholder="Enter text for front cover"
      />
      <h2>Back Cover</h2>
      <input type="file" accept="image/*" onChange={handleBackCoverUpload} />
      <input
        type="text"
        value={backCoverText}
        onChange={(e) => setBackCoverText(e.target.value)}
        placeholder="Enter text for back cover"
      />
      <h2>Pages</h2>
      <button onClick={handlePageAdd}>Add Page</button>
      {pages.map((page, index) => (
        <div key={index}>
          <input
            type="text"
            value={page.text}
            onChange={(e) => handlePageTextChange(index, e.target.value)}
            placeholder="Enter text for page"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePageImageUpload(index, e)}
            placeholder="Choose background image"
          />
        </div>
      ))}
      <button onClick={generatePDF}>Generate PDF</button>
      {pdfUrl && <a href={pdfUrl} download="custom-pdf.pdf">Download PDF</a>}
    </div>
  );
}

export default App;
