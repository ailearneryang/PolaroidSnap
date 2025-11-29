import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera as CameraIcon, X, SwitchCamera, Zap } from 'lucide-react';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [flashTriggered, setFlashTriggered] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1920 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError('无法访问相机，请检查权限。');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;

    if (isFlashOn) {
      setFlashTriggered(true);
      setTimeout(() => setFlashTriggered(false), 300);
    }

    // Short delay if flash is on to simulate sync
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const video = videoRef.current!;
      
      // Make it square or 3:4 based on polaroid preference, here we do square crop from center
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Crop center
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        
        // Flip horizontally if using user facing camera for mirror effect (optional, typically expected)
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        onCapture(canvas.toDataURL('image/jpeg', 0.9));
      }
    }, isFlashOn ? 100 : 0);
  }, [onCapture, isFlashOn]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 ${flashTriggered ? 'opacity-100' : 'opacity-0'} z-50`} 
      />

      <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-900 overflow-hidden rounded-lg shadow-2xl">
        {error ? (
          <div className="flex h-full items-center justify-center text-white p-6 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100" // Mirror preview
          />
        )}

        {/* Camera UI Overlays */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
          <button 
            onClick={() => setIsFlashOn(!isFlashOn)} 
            className={`p-2 rounded-full ${isFlashOn ? 'text-yellow-400 bg-white/20' : 'text-white/70 hover:bg-white/10'}`}
          >
            <Zap size={24} fill={isFlashOn ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg p-8 flex justify-center items-center gap-8">
        <button 
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          aria-label="Capture"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </div>
  );
};
