import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useVoice from "../hooks/useVoice.js";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState("");
  const [assistantAvatar, setAssistantAvatar] = useState("");

  // Load user’s assistant prefs
  useEffect(() => {
    const name = localStorage.getItem("assistantName");
    const avatar = localStorage.getItem("assistantAvatar");
    if (!name || !avatar) {
      navigate("/profile");
    } else {
      setAssistantName(name);
      setAssistantAvatar(avatar);
    }
  }, [navigate]);

  // derive wake word (lowercase)
  const wakeWord = useMemo(
    () => (assistantName ? assistantName.toLowerCase() : "assistant"),
    [assistantName]
  );

  // voice hook
  const { isListening, command, speak } = useVoice(wakeWord);

  // send recognized command to backend
  useEffect(() => {
    const sendCommand = async () => {
      if (!command) return;
      try {
        const res = await axios.post(
          "http://localhost:8001/api/user/ask",
          { command },
          { withCredentials: true }
        );
        const { response: aiResponse } = res.data;
        speak(aiResponse);
      } catch (err) {
        console.error("Assistant error:", err);
        speak("Sorry, something went wrong.");
      }
    };
    sendCommand();
  }, [command, speak]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handleCustomize = () => {
    navigate("/profile");
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#302b63_70%,#24243e_100%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]"></div>

      {/* Top Action Bar */}
      <div className="absolute top-4 right-4 flex gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-3 py-2">
        <button
          onClick={handleCustomize}
          className="px-3 py-1.5 rounded-md text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition shadow-lg shadow-indigo-500/30"
        >
          Customize
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition shadow-lg shadow-red-500/30"
        >
          Logout
        </button>
      </div>

      {/* Status */}
      <div className="absolute top-4 left-4 text-xs text-gray-400">
        {isListening ? `Listening for "${wakeWord}"...` : "Not listening"}
      </div>

      {/* Main Content */}
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-2 text-center">
        Welcome Back!
      </h1>
      <p className="text-gray-300 mb-8 text-lg text-center">
        Say “{wakeWord} ...” to talk to your assistant. 🚀
      </p>

      {/* Avatar */}
      <div className="group relative h-48 w-48 rounded-full p-[4px]">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500 opacity-80 group-hover:opacity-0 transition"></div>
        <div className="rainbow-ring absolute inset-0 rounded-full"></div>
        {assistantAvatar ? (
          <img
            src={assistantAvatar}
            alt="Assistant Avatar"
            className="relative z-10 h-full w-full rounded-full object-cover shadow-lg group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="relative z-10 h-full w-full rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300">
            No Avatar
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-4 text-cyan-300">
        {assistantName || "Assistant"}
      </h2>
      <p className="text-gray-400 text-sm mt-2">Your AI Assistant</p>
    </div>
  );
};

export default Dashboard;
