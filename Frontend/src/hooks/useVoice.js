import { useState, useEffect, useRef } from "react";

export default function useVoice(wakeWord = "jarvis") {
    const [isListening, setIsListening] = useState(false);
    const [command, setCommand] = useState("");
    const recogRef = useRef(null);
    const errorCooldownRef = useRef(false);
    const restartTimeoutRef = useRef(null);
    useEffect(() => {
        const hasSR =
            "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
        if (!hasSR) {
            console.warn("SpeechRecognition not supported in this browser.");
            return;
        }
        const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recogRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.onstart = () => {
            setIsListening(true);
        };
        // this event is triggered when the recognition fn ends
        recognition.onend = () => {
            setIsListening(false);
            if (!errorCooldownRef.current) {
                restartRecognition();
            }
        };
        // this event is triggered when the recognition fn returns an error
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "network") {
                errorCooldownRef.current = true;
                safeStop();
                restartAfterDelay(5000);
            }
            if (event.error === "no-speech" || event.error === "audio-capture") {
                errorCooldownRef.current = true;
                safeStop();
                restartAfterDelay(1500);
            }
        };
        // this event is triggered when the recognition service return a result
        recognition.onresult = (event) => {
            const lastIdx = event.results.length - 1;
            const raw = event.results[lastIdx][0].transcript;
            const text = raw.toLowerCase().trim();
            console.log("Heard:", text);
            const ww = wakeWord.toLowerCase();
            if (text.includes(ww)) {
                const userCommand = text.replace(ww, "").trim();
                if (userCommand) {
                    setCommand(userCommand);
                }
            }
        };
        const safeStop = () => {
            try {
                recognition.stop();
            } catch (_) {}
        };
        // restartRecognition is used to restart the recognition after process
        const restartRecognition = () => {
            clearTimeout(restartTimeoutRef.current);
            try {
                recognition.start();
            } catch (err) {
                restartAfterDelay(500);
            }
        };
        // restartAfterDelay is used to restart recognition after a delay
        function restartAfterDelay(ms) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
                errorCooldownRef.current = false;
                restartRecognition();
            }, ms);
        }
        recognition.start();
        return () => {
            clearTimeout(restartTimeoutRef.current);
            recognition.onstart = null;
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
            safeStop();
        };
    }, [wakeWord]);

    const speak = (text) => {
        if (!text) return;
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.pitch = 1;
        utterance.rate = 1;
        synth.speak(utterance);
    };

    return { isListening, command, speak };
}
