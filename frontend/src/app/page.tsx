"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import VideoUpload from '../components/VideoUpload';
import { PlayCircle, Clock, AlertCircle, CheckCircle2, Activity } from 'lucide-react';

type Video = {
  id: number;
  filename: string;
  status: string;
};

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await axios.get(`${apiUrl}/api/videos/`);
      setVideos(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'processing': return <Activity className="w-5 h-5 text-amber-500 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <PlayCircle className="text-blue-600 w-8 h-8" /> 
            CatVision AI Dashboard
          </h1>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <VideoUpload />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Videos</h2>
          <div className="grid gap-4">
            {videos.length === 0 ? (
                <div className="text-slate-500 text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">No videos uploaded yet.</div>
            ) : (
                videos.map(video => (
                  <Link href={`/videos/${video.id}`} key={video.id}>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                      <div className="flex items-center space-x-5">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-sm">{video.filename}</p>
                          <p className="text-sm font-medium text-slate-500 capitalize flex items-center gap-2 mt-1">
                            {getStatusIcon(video.status)} 
                            <span className={video.status === 'completed' ? 'text-emerald-700' : video.status === 'failed' ? 'text-rose-700' : 'text-amber-700'}>
                                {video.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        View Analysis &rarr;
                      </div>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
