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
      setAnswer("");
      setLoading(true);
  
      const response = await axios.post("https://qandaserver.onrender.com/ask", {
        question,
        documentContent: localStorage.getItem("documentContent"),
      });
  
      console.log(response.data, "response");
      if (response.data?.answers && response.data.answers.length > 0) {
        setLoading(false);
  
        // Extract the relevant part of the answer
        const relevantAnswer = response.data.answers
          .map((item) => {
            if (item.answer?.candidates) {
              return item.answer.candidates
                .map((candidate) =>
                  candidate.content?.parts
                    ?.map((part) => part.text)
                    .join("")
                    .split(".")[0] // Take the first sentence
                )
                .join("");
            }
            return null;
          })
          .filter(Boolean) // Remove null values
          .find((ans) => ans.includes("The price of Widget A is")); // Find the most relevant part
  
        setAnswer(relevantAnswer || "No clear answer found.");
      } else {
        setAnswer("No answer found.");
      }
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