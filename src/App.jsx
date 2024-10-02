import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
import {
  FaMicrophone,
  FaStop,
  FaClipboard,
  FaCheck,
  FaTrash,
  FaVolumeUp,
} from "react-icons/fa";

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setTextToCopy(transcript);
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
    setIsListening(!isListening);
  };

  const clearTranscript = () => {
    resetTranscript();
    SpeechRecognition.stopListening();
  };

  const listenToTranscript = () => {
    const speech = new SpeechSynthesisUtterance(transcript);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Speech Recognition Not Supported
        </h2>
        <p>Your browser doesn't support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <h2 className="text-3xl font-semibold text-center mb-4 text-primary">
          SpeakGenie
        </h2>
        <p className="text-center mb-6">
          Convert speech from the microphone to text in real time.
        </p>

        <div className="relative mb-6">
          <div className="flex justify-between items-center bg-base-300 p-2 rounded-t-lg">
            <h3 className="font-semibold text-lg">Transcript</h3>
            <div className="flex items-center space-x-2">
              {/* Responsive Clear Button with disable state */}
              <button
                className={`btn ${
                  transcript ? "btn-error" : "btn-disabled"
                } flex items-center space-x-2 px-4 py-2 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition`}
                onClick={clearTranscript}
                disabled={!transcript} // Disabled when transcript is empty
              >
                <FaTrash className="sm:mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </button>

              {/* Responsive Copy Button */}
              <button
                className={`btn ${
                  textToCopy ? "btn-success" : "btn-disabled"
                } flex items-center space-x-2 px-4 py-2 hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 transition duration-200 ease-in-out`}
                onClick={() => {
                  if (textToCopy) {
                    setCopied();
                  }
                }}
                disabled={!textToCopy}
              >
                {isCopied ? (
                  <>
                    <FaCheck className="sm:mr-1" />{" "}
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <FaClipboard className="sm:mr-1" />{" "}
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <textarea
            className="bg-base-300 p-4 rounded-b-lg shadow-md text-lg w-full h-40 border border-base-200 resize-none"
            value={transcript || "Start speaking..."}
            readOnly
          />
        </div>

        {/* Responsive button section */}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
          <button
            className={`btn ${
              isListening ? "btn-error" : "btn-success"
            } transition duration-200 ease-in-out flex items-center justify-center px-4 py-2`}
            onClick={toggleListening}
          >
            {isListening ? (
              <FaStop className="mr-2" />
            ) : (
              <FaMicrophone className="mr-2" />
            )}
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>

          <button
            className="btn btn-info flex items-center justify-center px-4 py-2"
            onClick={listenToTranscript}
          >
            <FaVolumeUp className="mr-2" />
            Listen
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
