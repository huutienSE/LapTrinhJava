import { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const readManagerTranscript = () => {
  const manager = SpeechRecognition.getRecognitionManager();
  return [manager.finalTranscript, manager.interimTranscript]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();
};

export function useSpeechAnswer() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ clearTranscriptOnListen: true });

  const [capturedText, setCapturedText] = useState("");
  const [micError, setMicError] = useState(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const requestMicrophone = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return true;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setMicError(null);
    setCapturedText("");
    resetTranscript();

    const allowed = await requestMicrophone();
    if (!allowed) {
      setMicError("Vui lòng cho phép quyền micro trong trình duyệt.");
      return;
    }

    try {
      await SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } catch {
      setMicError("Không thể bật nhận diện giọng nói. Hãy thử lại.");
    }
  }, [requestMicrophone, resetTranscript]);

  const stopRecording = useCallback(async () => {
    setMicError(null);
    try {
      await SpeechRecognition.stopListening();
      const fromManager = readManagerTranscript();
      const text = fromManager || transcriptRef.current.trim();
      setCapturedText(text);
      resetTranscript();
      if (!text) {
        setMicError(
          "Không nhận diện được giọng nói. Hãy nói rõ hơn hoặc thử lại."
        );
      }
    } catch {
      setMicError("Không thể dừng ghi âm. Vui lòng thử lại.");
    }
  }, [resetTranscript]);

  const clearRecording = useCallback(async () => {
    try {
      await SpeechRecognition.abortListening();
    } catch {
      // ignore if nothing was listening
    }
    resetTranscript();
    setCapturedText("");
    setMicError(null);
  }, [resetTranscript]);

  const displayText = listening ? transcript : capturedText;
  const canSubmit = Boolean(capturedText.trim()) && !listening;

  return {
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    displayText,
    capturedText,
    canSubmit,
    micError,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
