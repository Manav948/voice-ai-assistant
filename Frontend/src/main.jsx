import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div className="absolute inset-0 z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: 'bg-gray-800 text-white',
              style: {
                fontSize: '16px',
                padding: '10px 20px',
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
