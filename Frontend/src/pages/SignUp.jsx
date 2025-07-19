import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bg from '../assets/sign-up.png'
import api from '../lib/axios.js'
import { toast } from "react-hot-toast";
export default function SignUp() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/auth/signUp", form);
            toast.success("signUp successful! Please log in.");
        } catch (error) {
            console.log("Error during sign up:", error);
            toast.error(error.response?.data?.message || "Sign up failed.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#302b63_70%,#24243e_100%)]"></div>
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]"></div>

            <div className="flex min-h-screen  items-center justify-center px-4 py-8">
                {/* Left Image Side */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex w-1/2 items-center justify-center"
                >
                    <img
                        src={bg}
                        alt="Sign Up"
                        className="w-4/6 drop-shadow-[0_0_20px_#00ffe7] rounded-full"
                    />
                </motion.div>

                {/* Form Side */}
                <div className="flex w-full md:w-1/2 items-center justify-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="w-full max-w-md backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg"
                    >
                        <h1 className="text-3xl font-semibold text-white mb-2">Create an Account 🎉</h1>
                        <p className="text-sm text-gray-300 mb-6">Sign up to get started with your assistant</p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                className="w-full border border-white/20 bg-transparent px-4 py-3 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                type="text"
                                name="username"
                                placeholder="Username"
                                autoComplete="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full border border-white/20 bg-transparent px-4 py-3 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="w-full border border-white/20 bg-transparent px-4 py-3 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="submit"
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
                            >
                                Sign Up
                            </button>
                        </form>

                        <p className="mt-4 text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link to="/signin" className="text-cyan-400 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
