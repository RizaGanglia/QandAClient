import React, { useState } from "react";
import axios from "axios";
import UploadDocument from "./UploadDocument";
import QuestionInput from "./QuestionInput";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState("");
  const [loading ,setLoading] = useState(false);

  const handleAskQuestion = async (question) => {
    try {
      setAnswer('')
      setLoading(true)
      const response = await axios.post("https://qandaserver.onrender.com/ask", {
        question,
        documentContent: localStorage.getItem("documentContent"), // Store documentContent in localStorage
      });
      console.log(response.data, "response");
      if (response.data?.answers && response.data.answers.length > 0) {
        setLoading(false)
        // Extract the text from each answer
        const answers = response.data.answers.map((item) => {
          if (item.answer?.candidates) {
            return item.answer.candidates
              .map(candidate => candidate.content?.parts?.map(part => part.text).join(''))
              .join('') || 'No answer text available';
          }
          return 'No candidates available';
        });
        setAnswer(answers.join('')); 

      }
        // Join all answers and display the first one (assuming you want the first result)
      // setAnswer(response.data.answers[0].answer);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Error processing your request.");
    }
  };
  

  return (
    <div className="app-container">
      <header>
        <h1>AI-Powered Document Q&A</h1>
      </header>
      <main>
        <UploadDocument />
        <QuestionInput handleAskQuestion={handleAskQuestion} />
        <>{loading ? 'loading...' : ''}</>
        {answer && (
          <div className="answer-container">
            <h3>Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
