import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useSpeechAnswer() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [capturedText, setCapturedText] = useState("");

  const startRecording = () => {
    setCapturedText("");
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setCapturedText(transcript);
    resetTranscript();
  };

  const clearRecording = () => {
    SpeechRecognition.abortListening();
    resetTranscript();
    setCapturedText("");
  };

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