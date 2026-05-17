import { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useSpeechAnswer() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [capturedText, setCapturedText] = useState("");
  const transcriptRef = useRef("");
  const pendingStopRef = useRef(false);

  transcriptRef.current = transcript;

  useEffect(() => {
    if (!listening && pendingStopRef.current) {
      pendingStopRef.current = false;
      setCapturedText(transcriptRef.current.trim());
    }
  }, [listening]);

  const startRecording = () => {
    pendingStopRef.current = false;
    setCapturedText("");
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopRecording = () => {
    pendingStopRef.current = true;
    SpeechRecognition.stopListening();
  };

  const clearRecording = () => {
    pendingStopRef.current = false;
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
