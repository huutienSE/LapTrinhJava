import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useSpeechAnswer() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,

  const [capturedText, setCapturedText] = useState("");

    setCapturedText("");
    resetTranscript();
      continuous: true,
      language: "en-US",
    });

    resetTranscript();

    resetTranscript();
    setCapturedText("");

  const displayText = listening ? transcript : capturedText;
  const canSubmit = Boolean(capturedText.trim()) && !listening;

  return {
    browserSupportsSpeechRecognition,
    listening,
    displayText,
    capturedText,
    canSubmit,
    startRecording,
    stopRecording,
    clearRecording,
  };
}