"use client";

import { useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // File size validation (50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/api/videos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      router.push(`/videos/${res.data.id}`);
    } catch (err: any) {
        setError(err.response?.data?.detail || "Upload failed");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors">
      <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${file ? 'text-blue-500' : 'text-gray-400'}`} />
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload Video for Analysis</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">Max 50MB, up to 60 seconds.</p>
      
      <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" id="video-upload" />
      <label htmlFor="video-upload" className="cursor-pointer bg-white border border-gray-300 px-6 py-2.5 rounded-full shadow-sm hover:shadow-md hover:border-gray-400 flex items-center justify-center mb-4 transition-all text-sm font-medium text-gray-700">
        {file ? file.name : "Select Video"}
      </label>

      {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className={`w-full max-w-xs px-6 py-3 rounded-full text-white font-medium transition-all ${(!file || uploading) ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
      >
        {uploading ? 'Processing & Uploading...' : 'Start Analysis'}
      </button>
    </div>
  );
}
