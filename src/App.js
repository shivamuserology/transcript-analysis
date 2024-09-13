import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [transcripts, setTranscripts] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/transcripts');
      setTranscripts(response.data);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('transcripts', files[i]);
    }

    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchTranscripts();
    } catch (error) {
      console.error('Error uploading transcripts:', error);
    }
  };

  const handleAskQuestion = async () => {
    try {
      const response = await axios.post('http://localhost:3001/ask', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <div className="App">
      <h1>Transcript Q&A</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      <div>
        <h2>Processed Transcripts:</h2>
        {transcripts.map((transcript, index) => (
          <div key={index}>
            <h3>{transcript.name}</h3>
            <h4>Summary:</h4>
            <p>{transcript.summary}</p>
            <h4>Key Findings:</h4>
            <p>{transcript.findings}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question"
        />
        <button onClick={handleAskQuestion}>Ask</button>
      </div>
      {answer && (
        <div>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;