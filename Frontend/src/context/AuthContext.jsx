import api from "../lib/axios.js";
import { createContext, useContext, useState, useEffect } from "react";

const authContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("http://localhost:8001/api/user/user",
                    { withCredentials: true });
                setUser(data);
                if (data.assistantName) {
                    localStorage.setItem("assistantName", data.assistantName)
                    localStorage.setItem("assistantAvatar", data.assistantAvatar)
                }
            } catch {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        })
    })
    return (
        <authContext.Provider value={{ user, setUser, authLoading }}>
            {children}
        </authContext.Provider>
    );
}
export const useAuth = () => useContext(authContext);