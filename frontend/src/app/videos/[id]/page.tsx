"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Cat, CheckCircle2, AlertCircle, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

type Prediction = {
  timestamp: number;
  cat_present: boolean;
  confidence: number | null;
};

type VideoDetails = {
  id: number;
  filename: string;
  status: string;
  filepath: string;
  duration: number | null;
  predictions: Prediction[];
};

export default function VideoAnalysis() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<VideoDetails | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await axios.get(`${apiUrl}/api/videos/${params.id}`);
        setVideo(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
    const interval = setInterval(() => {
      if(video?.status !== 'completed' && video?.status !== 'failed') {
          fetchVideo();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, video?.status]);

  if (!video) return <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50 text-slate-500 font-medium">Loading analysis...</div>;

  const catsDetected = video.predictions.filter(p => p.cat_present);

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium pb-2 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">{video.filename}</h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium">
            <span className={`px-4 py-1.5 rounded-full capitalize flex items-center gap-2 shadow-sm ${
                video.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                video.status === 'failed' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {video.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
               video.status === 'failed' ? <AlertCircle className="w-4 h-4" /> : <Activity className="w-4 h-4 animate-pulse" />}
              {video.status}
            </span>
            {video.duration && (
              <span className="bg-slate-100 border border-slate-200 text-slate-800 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                <Clock className="w-4 h-4" />
                {video.duration.toFixed(1)}s
              </span>
            )}
          </div>
        </header>

        {video.status === 'completed' && (
          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Cat className="w-6 h-6 text-purple-500" />
                Cat Detections
              </h2>
              <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 mb-6 flex items-center justify-between shadow-inner">
                <span className="font-semibold text-purple-900">Total Frames with Cats</span>
                <span className="text-3xl font-black text-purple-700">{catsDetected.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  <div className="bg-blue-50 p-4 rounded-xl border">
    <p className="text-xs text-slate-500">Duration</p>
    <p className="text-2xl font-black text-slate-900">
      {video.duration?.toFixed(1)}s
    </p>
  </div>

  <div className="bg-green-50 p-4 rounded-xl border">
    <p className="text-xs text-slate-500">Detections</p>
    <p className="text-2xl font-black text-slate-900">
      {catsDetected.length}
    </p>
  </div>

  <div className="bg-purple-50 p-4 rounded-xl border">
    <p className="text-xs text-slate-500">Avg Confidence</p>
    <p className="text-2xl font-black text-slate-900">
      {catsDetected.length > 0
        ? (
            catsDetected.reduce(
              (sum, p) => sum + (p.confidence || 0),
              0
            ) / catsDetected.length * 100
          ).toFixed(0)
        : 0}
      %
    </p>
  </div>
</div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {catsDetected.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 font-medium">No cats detected in this video.</p>
                ) : (
                  catsDetected.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-mono bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-md text-slate-700 text-sm font-bold">
                        {p.timestamp.toFixed(2)}s
                      </span>
                      <span className="text-emerald-600 text-sm font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" />
                        {((p.confidence || 0) * 100).toFixed(1)}% conf
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
            
            <section className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center min-h-[350px] relative group">
                <video 
                    controls 
                    className="w-full h-full object-contain bg-black" 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${video.filepath}`} 
                />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
