import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import AssistantSetup from './pages/AssistantSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/assistant-setup" element={<AssistantSetup />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
