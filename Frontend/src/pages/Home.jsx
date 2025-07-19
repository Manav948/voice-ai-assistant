import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bot from "../assets/home.png"; 

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#302b63_70%,#24243e_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]" />
      <div className="flex h-full flex-col md:flex-row items-center justify-between px-8 md:px-20 gap-10">
        {/* Text Section */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 mt-24 md:mt-0"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-6">
            Your Virtual Assistant <br />
            <span className="text-cyan-400">Smarter. Faster. Easier.</span>
          </h1>
          <p className="text-gray-300 mb-8 text-lg max-w-xl">
            Let our intelligent assistant help you streamline your daily tasks with ease and precision.
          </p>
          <Link
            to="/signup"
            className="inline-block px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/30"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Bot Image Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={bot}
            alt="Assistant Bot"
            className="w-80 md:w-[400px] drop-shadow-[0_0_25px_#00ffe7] animate-float rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
