import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [emailText, setEmailText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create floating particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 10 + 5;
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      particle.style.opacity = opacity;

      document.body.appendChild(particle);

      // Remove particle after animation completes to prevent DOM overload
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    };

    // Add animation keyframes
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-100px) rotate(180deg); }
        100% { transform: translateY(0) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      createParticle();
    }

    // Continuous particle creation
    const interval = setInterval(createParticle, 2000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(emailText, "I am email text");

    try {
      // In a real app, you would call your backend API here
      // This is a mock implementation for demonstration
      // const response = await mockApiCall(emailText)
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: emailText }),
      });

      const result = await response.json();

      setPrediction(result.prediction);
      // setConfidence(response.confidence);
    } catch (err) {
      setError("Failed to classify email. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-2">
        Email Spam Classifier
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Advanced AI-powered email analysis system
      </p>

      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side: Email Input */}
        <div className="md:w-1/2 p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <label htmlFor="emailInput" className="font-semibold text-lg mb-2">
              Enter Email Text
            </label>
            <textarea
              id="emailInput"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email content here for analysis..."
              rows={12}
              className="resize-none p-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="spinner mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ANALYZING...
                </span>
              ) : (
                "ANALYZE EMAIL"
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Buttons + Result */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-white border-l">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Test Examples</h3>
            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <button
                onClick={() =>
                  setEmailText(
                    "Congratulations! You've won a $10,000 prize! Click here to claim your money now! This offer is only valid for the next 30 minutes!"
                  )
                }
                className="bg-red-400 text-red-800 px-4 py-2 rounded hover:bg-red-200"
              >
                Spam Example
              </button>
              <button
                onClick={() =>
                  setEmailText(
                    "Hi team, just a reminder about our meeting tomorrow at 10 AM in the conference room. Please bring your quarterly reports. Best regards, Sarah Johnson"
                  )
                }
                className="bg-green-400 text-green-800 px-4 py-2 rounded hover:bg-green-200"
              >
                Ham Example
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 font-medium">{error}</div>}

          {prediction && (
            <div
              className={`text-center text-xl font-bold px-4 py-2 rounded-lg ${
                prediction.includes("spam")
                  ? "bg-red-300 text-red-800"
                  : "bg-green-300 text-green-800"
              }`}
            >
              {prediction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
