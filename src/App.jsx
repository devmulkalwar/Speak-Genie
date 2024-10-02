import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
import { FaMicrophone, FaStop, FaClipboard, FaCheck, FaTrash, FaVolumeUp } from "react-icons/fa";

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);

  // Update textToCopy whenever transcript changes
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
    resetTranscript(); // Reset the transcript from the speech recognition library
    SpeechRecognition.stopListening(); // Ensure listening is stopped
  };

  const listenToTranscript = () => {
    const speech = new SpeechSynthesisUtterance(transcript);
    speech.lang = 'en-IN'; // Set the language for speech
    window.speechSynthesis.speak(speech); // Speak the text in the textarea
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 p-6">
      <div className="bg-base-100 rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <h2 className="text-3xl font-semibold text-center mb-4 text-primary">
          SpeakGenie
        </h2>
        <p className="text-center mb-6">
          Convert speech from the microphone to text in real time.
        </p>

        <div className="relative mb-6">
          <div className="flex justify-between items-center bg-base-300 p-2 rounded-t-lg">
            <h3 className="font-semibold text-lg">Transcript</h3>
            <button
              className={`btn ${textToCopy ? "btn-success" : "btn-disabled"} flex items-center transition duration-200 ease-in-out`}
              onClick={() => {
                if (textToCopy) {
                  setCopied(); // Copy the current text to clipboard
                }
              }}
              disabled={!textToCopy} // Disable if textToCopy is empty
            >
              {isCopied ? (
                <>
                  <FaCheck className="mr-2" /> Copied!
                </>
              ) : (
                <>
                  <FaClipboard className="mr-2" /> Copy
                </>
              )}
            </button>
          </div>

          <textarea
            className="bg-base-300 p-4 rounded-b-lg shadow-md text-lg w-full h-40 border border-base-200 resize-none"
            value={transcript || "Start speaking..."}
            readOnly
          />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            className={`btn ${isListening ? "btn-error" : "btn-success"} transition duration-200 ease-in-out flex items-center`}
            onClick={toggleListening}
          >
            {isListening ? <FaStop className="mr-2" /> : <FaMicrophone className="mr-2" />}
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>

          <button
            className="btn btn-error flex items-center"
            onClick={clearTranscript}
          >
            <FaTrash className="mr-2" />
            Clear
          </button>

          <button
            className="btn btn-info flex items-center"
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
