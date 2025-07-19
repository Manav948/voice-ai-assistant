import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadAvatar from '../component/UploadAvatar';
import { toast } from 'react-hot-toast'
import P1 from '../assets/avatar/P1.avif';
import P2 from '../assets/avatar/P2.avif';
import P3 from '../assets/avatar/P3.jpg';
import P4 from '../assets/avatar/p4.avif';
import P5 from '../assets/avatar/p5.jpeg';

const Profile = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [avatarFiles, setAvatarFiles] = useState([P1, P2, P3, P4, P5]);
  const navigate = useNavigate();

  const handleAvatarUpload = (url) => {
    setAvatarFiles((prev) => [url, ...prev]);
    setSelectedAvatar(url);
  };

  const handleAvatarSelect = (url) => {
    setSelectedAvatar(url);
  };

  const handleNext = () => {
    if (!selectedAvatar) {
      toast.error('Please select or upload an avatar before continuing.');
      return;
    }
    toast.success('Avatar selected successfully!');
    navigate('/assistant-setup', { state: { avatar: selectedAvatar } });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#302b63_70%,#24243e_100%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:14px_24px]"></div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-cyan-400 mb-6">
          Choose Your AI Assistant Avatar 💡
        </h1>
        <p className="text-gray-300 mb-10">
          Upload your own avatar or pick one from our collection.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-xl">
          <UploadAvatar onUpload={handleAvatarUpload} />
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">
              Or Select from Our Avatars
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {avatarFiles.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Avatar ${index + 1}`}
                  className={`h-24 w-24 object-cover rounded-xl cursor-pointer transition hover:scale-105 shadow-lg ${selectedAvatar === img
                      ? 'ring-2 ring-cyan-500 scale-105'
                      : 'opacity-80 hover:opacity-100'
                    }`}
                  onClick={() => handleAvatarSelect(img)}
                />
              ))}
            </div>
          </div>
        </div>

        {selectedAvatar && (
          <div className="mt-10">
            <h3 className="text-lg text-gray-300 mb-4">Your Selected Avatar:</h3>
            <img
              src={selectedAvatar}
              alt="Selected AI"
              className="h-36 mx-auto rounded-xl border border-cyan-500 shadow-lg mb-6"
            />
          </div>
        )}

        <button
          onClick={handleNext}
          className="mt-6 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Profile;
