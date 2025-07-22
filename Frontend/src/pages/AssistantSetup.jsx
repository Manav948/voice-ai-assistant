import api from '../lib/axios.js'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
const AssistantSetup = () => {
    const {user , setUser} = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const avatar = location.state?.avatar || '';
    const [assistantName, setAssistantName] = useState('');

    const handleContinue = async () => {
        if (!assistantName) {
            toast.error('Please enter a name for your assistant.');
            return;
        }
        if (!avatar) {
            toast.error('Please Select or upload Valid Assistant avatar');
        }
        try {
            const { data } = await api.put("http://localhost:8001/api/user/assistant",
                { assistantName, assistantAvatar: avatar },
                { withCredentials: true }
            );
            localStorage.setItem("assistantName", assistantName);
            localStorage.setItem("assistantAvatar", avatar);
            if(data?.user) setUser(data.user)
            toast.success("assistant saved !");
            navigate("/dashboard")
        } catch (error) {
            console.log("Error in Save Assitant function :  ", error);
            toast.error("Failed to Load Assistant")
        }

    }
    return (
        <div className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-cyan-400 mb-6">
                    Setup Your Virtual Assistant 🤖
                </h1>

                {avatar && (
                    <img
                        src={avatar}
                        alt="Selected Avatar"
                        className="h-40 mx-auto rounded-xl border border-cyan-500 shadow-lg mb-6"
                    />
                )}

                <input
                    type="text"
                    placeholder="Give your assistant a name..."
                    className="w-full border border-white bg-transparent px-4 py-3 mb-6 rounded-full text-sm text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                />

                <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default AssistantSetup;
