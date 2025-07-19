// src/hooks/useVoice.js
import { useState, useEffect, useRef } from "react";

export default function useVoice(wakeWord = "jarvis") {
    const [isListening, setIsListening] = useState(false);
    const [command, setCommand] = useState("");

    const recogRef = useRef(null);
    const errorCooldownRef = useRef(false); // true when we hit network error
    const restartTimeoutRef = useRef(null);

    useEffect(() => {
        // Guard: browser support
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

        // Config
        recognition.continuous = true; // keep listening
        recognition.interimResults = false;
        recognition.lang = "en-US"; // change to 'en-IN' if you want Hinglish bias

        // Events
        recognition.onstart = () => {
            setIsListening(true);
            // console.log("Recognition started");
        };

        recognition.onend = () => {
            setIsListening(false);
            // console.log("Recognition ended");
            // If we ended normally AND not in cooldown, restart
            if (!errorCooldownRef.current) {
                restartRecognition();
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);

            // NETWORK error → pause & retry later
            if (event.error === "network") {
                errorCooldownRef.current = true;
                safeStop();
                restartAfterDelay(5000); // wait 5s then restart
            }

            // NO-SPEECH or AUDIO-CAPTURE errors: also try restart after short pause
            if (event.error === "no-speech" || event.error === "audio-capture") {
                errorCooldownRef.current = true;
                safeStop();
                restartAfterDelay(1500);
            }
        };

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

        // Helpers
        const safeStop = () => {
            try {
                recognition.stop();
            } catch (_) { }
        };

        const restartRecognition = () => {
            clearTimeout(restartTimeoutRef.current);
            try {
                recognition.start();
            } catch (err) {
                // Chrome throws if start() called while active; retry
                restartAfterDelay(500);
            }
        };

        function restartAfterDelay(ms) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
                errorCooldownRef.current = false;
                restartRecognition();
            }, ms);
        }

        // Kick off
        recognition.start();

        // Cleanup
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
        synth.cancel(); // stop anything currently speaking
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US"; // consider 'en-IN' for Indian accent
        utterance.pitch = 1;
        utterance.rate = 1;
        synth.speak(utterance);
    };

    return { isListening, command, speak };
}
