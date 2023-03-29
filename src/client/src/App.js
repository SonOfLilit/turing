import React, { useState, useEffect } from "react";

function App() {
  const [level, setLevel] = useState(0);
  const [question, setQuestion] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLevel();
  }, [level]);

  const fetchLevel = async () => {
    setLoading(true);
    const response = await fetch(`/level/${level}`);
    const data = await response.json();
    setQuestion(data.question);
    setBotAnswer(data.bot_answer);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`/level/${level}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_answer: userAnswer }),
    });
    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  };

  const handleNextLevel = () => {
    setLevel(level + 1);
    setUserAnswer("");
    setResult(null);
  };

  const handleTryAgain = () => {
    setUserAnswer("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-lightBlue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-4">Level {level + 1}</h1>
              <p className="mb-4">Question: {question}</p>
              {result === null ? (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="userAnswer" className="block mb-2">
                    Your Answer:
                  </label>
                  <input
                    type="text"
                    id="userAnswer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline mb-4"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <div>
                  <p className="mb-4">Bot Answer: {botAnswer}</p>
                  <p className="mb-4">
                    {result ? "Correct!" : "Wrong. Try again."}
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                  >
                    Try again
                  </button>
                  <button
                    onClick={handleNextLevel}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Next Level
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
