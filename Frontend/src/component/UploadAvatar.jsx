import React, { useState } from 'react'
import axios from 'axios'
const UploadAvatar = ({ onUpload }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [preview, setPreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));// uderstanding this line after project completion
        }
    }

    const handleUpload = async () => {
        if (!image) {
            alert("Please Select an image to upload");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', image);
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8001/api/user/upload-avatar', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUrl(response.data.imageUrl);
            onUpload(response.data.imageUrl);
        } catch (error) {
            console.log('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-md backdrop-blur-sm ">
            <h2 className="text-xl font-semibold mb-4">Upload Your AI Avatar 👤</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
            />

            {preview && <img src={preview} alt="Preview" className="h-32 mt-4 rounded-lg" />}

            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>

            {url && (
                <div className="mt-4">
                    <p className="text-green-400">Uploaded Successfully!</p>
                    <img src={url} alt="Uploaded" className="h-24 mt-2 rounded border border-green-400" />
                </div>
            )}
        </div>
    );
}

export default UploadAvatar;
