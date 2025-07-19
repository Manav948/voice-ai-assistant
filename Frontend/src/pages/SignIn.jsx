import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bg from '../assets/sign-in-2.png';
import { useState } from "react";
import api from '../lib/axios.js';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('api/auth/login', form)
      toast.success("Login successful!");
      navigate('/profile');
    } catch (error) {
      console.log("error during login:", error);
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#302b63_70%,#24243e_100%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]"></div>
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        {/* Left Image Side */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 items-center justify-center"
        >
          <img
            src={bg}
            alt="AI Assistant"
            className="w-2/4 drop-shadow-[0_0_20px_#836fff] rounded-full"
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
            <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back 👋</h1>
            <p className="text-sm text-gray-300 mb-6">Sign in to your assistant dashboard</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                className="w-full border border-white/20 bg-transparent px-4 py-3 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="w-full border border-white/20 bg-transparent px-4 py-3 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="password"
                name="password"
                placeholder="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required

              />
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-400 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
