import React, { useState, useEffect } from 'react';
import { Camera as CameraIcon, Upload, Download, Sparkles, RefreshCw, Trash2, Camera, Aperture } from 'lucide-react';
import { Camera as CameraView } from './components/Camera';
import { PolaroidFrame } from './components/PolaroidFrame';
import { downloadPolaroid } from './utils/canvasUtils';
import { generatePhotoCaption } from './services/geminiService';
import { AppState, PolaroidData } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [polaroidData, setPolaroidData] = useState<PolaroidData | null>(null);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Helper to process a new image (from camera or upload)
  const handleNewImage = (src: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '.');

    setPolaroidData({
      imageSrc: src,
      caption: '',
      date: dateStr
    });
    setAppState(AppState.PREVIEW);
    
    // Start "Developing" animation
    setIsDeveloping(true);
    setTimeout(() => setIsDeveloping(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleNewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!polaroidData) return;
    setIsAiLoading(true);
    const caption = await generatePhotoCaption(polaroidData.imageSrc);
    setPolaroidData(prev => prev ? { ...prev, caption } : null);
    setIsAiLoading(false);
  };

  const handleDownload = () => {
    if (!polaroidData) return;
    downloadPolaroid(polaroidData.imageSrc, polaroidData.caption || "我的时刻", polaroidData.date);
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setPolaroidData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-camera-texture text-zinc-100 font-serif selection:bg-red-500 selection:text-white">
      {/* Viewfinder decorative corners */}
      <div className="fixed top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 m-4 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 m-4 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 m-4 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 m-4 pointer-events-none"></div>

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center max-w-4xl mx-auto z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
             <Aperture size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Polaroid Snap</h1>
        </div>
        {appState === AppState.PREVIEW && (
          <button onClick={reset} className="text-zinc-400 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full">
            <Trash2 size={24} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center p-4 relative z-0">
        
        {/* IDLE STATE: Selection Buttons */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col gap-10 items-center animate-in fade-in zoom-in duration-500 w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-xl tracking-wide">记录此刻</h2>
              <p className="text-zinc-400 text-lg font-light">复古胶片质感 • AI 灵感配文</p>
            </div>
            
            <div className="flex flex-row gap-6 justify-center w-full">
              {/* Camera Button - Styled like a shutter */}
              <button 
                onClick={() => setAppState(AppState.CAMERA)}
                className="group relative flex flex-col items-center gap-3 active:scale-95 transition-all duration-200"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)] group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none"></div>
                   <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-800">
                      <Camera size={36} className="text-red-500 group-hover:text-red-400 transition-colors" />
                   </div>
                </div>
                <span className="font-bold text-zinc-300 text-sm tracking-widest uppercase">拍照</span>
              </button>

              {/* Upload Button - Styled like a secondary dial */}
              <label className="group relative flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition-all duration-200">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)] group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full pointer-events-none"></div>
                   <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-800">
                      <Upload size={36} className="text-blue-500 group-hover:text-blue-400 transition-colors" />
                   </div>
                </div>
                <span className="font-bold text-zinc-300 text-sm tracking-widest uppercase">上传</span>
              </label>
            </div>
          </div>
        )}

        {/* CAMERA STATE */}
        {appState === AppState.CAMERA && (
          <CameraView 
            onCapture={handleNewImage} 
            onClose={() => setAppState(AppState.IDLE)} 
          />
        )}

        {/* PREVIEW STATE: The Polaroid Result */}
        {appState === AppState.PREVIEW && polaroidData && (
          <div className="flex flex-col items-center gap-8 w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* Spotlight effect behind the photo */}
            <div className="relative">
              <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <PolaroidFrame 
                imageSrc={polaroidData.imageSrc} 
                caption={polaroidData.caption} 
                date={polaroidData.date}
                isDeveloping={isDeveloping}
              />
            </div>

            {/* Controls */}
            <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${isDeveloping ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
              
              {/* Manual Caption Input */}
              <div className="w-full flex justify-center">
                 <input 
                  type="text" 
                  placeholder="点击输入文字..." 
                  className="bg-transparent border-b border-zinc-700 text-center font-handwriting text-2xl py-2 px-4 text-zinc-200 focus:outline-none focus:border-red-500 transition-colors w-72 placeholder:text-zinc-600"
                  value={polaroidData.caption}
                  onChange={(e) => setPolaroidData({...polaroidData, caption: e.target.value})}
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={generateCaption}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-purple-300 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:border-purple-500/50 hover:text-purple-200 transition-all disabled:opacity-50 font-medium shadow-lg"
                >
                  {isAiLoading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  <span>AI 灵感文案</span>
                </button>

                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 font-bold"
                >
                  <Download size={18} />
                  <span>下载 (Save)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-6 text-zinc-600 text-xs text-center">
        Powered by React & Gemini AI • Designed for moments
      </footer>
    </div>
  );
};

export default App;