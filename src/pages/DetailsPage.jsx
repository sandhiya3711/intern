import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef(null);
  const signatureRef = useRef(null);
  const isDrawing = useRef(false);

  // Start Camera
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCapturing(false);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/png'));
    
    // Stop stream tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Signature Logic
  const startDrawing = (e) => {
    const canvas = signatureRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = signatureRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

  // Merge & Save
  const mergeAndSave = () => {
    const mainCanvas = document.createElement('canvas');
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      mainCanvas.width = img.width;
      mainCanvas.height = img.height;
      const ctx = mainCanvas.getContext('2d');
      
      // Draw Base Photo
      ctx.drawImage(img, 0, 0);
      
      // Overlay Signature (scale to fit)
      const sigCanvas = signatureRef.current;
      ctx.drawImage(sigCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
      
      const merged = mainCanvas.toDataURL('image/png');
      localStorage.setItem(`audit_image_${id}`, merged);
      localStorage.setItem('last_audit_id', id);
      navigate('/analytics');
    };
  };

  /* 
     INTENTIONAL BUG: Hardware Stream Memory Leak
     As per the assignment requirements, this cleanup has been sabotaged.
     The camera stream will continue running in background even after navigation.
  */
  useEffect(() => {
    // Intentionally left empty to cause leak
    return () => {
      console.warn("INTENTIONAL BUG: Memory leak triggered. Camera stream tracks not stopped.");
    }; 
  }, [stream]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Identity <span className="gradient-text">Verification</span></h1>
          <p className="text-slate-400 font-medium mt-1">Audit Protocol for Employee #{id}</p>
        </div>
        <button 
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Cancel Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interaction Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative bg-slate-950">
            {!photo ? (
              <div className="relative aspect-video flex flex-col items-center justify-center group">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {!isCapturing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center animate-bounce">
                      <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <button 
                      onClick={startCamera}
                      className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                    >
                      Initialize Secure Camera
                    </button>
                  </div>
                )}

                {stream && (
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full bg-white border-[6px] border-white/20 shadow-2xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center overflow-hidden"
                    >
                       <div className="w-full h-full bg-white border-2 border-slate-900 rounded-full"></div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative aspect-video">
                <img src={photo} className="w-full h-full object-cover" alt="Verification" />
                <canvas
                  ref={signatureRef}
                  width={1280}
                  height={720}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                />
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="bg-primary-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/20">
                    Live Signature Overlay
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
             {photo && (
               <>
                <button 
                  onClick={() => { setPhoto(null); startCamera(); }}
                  className="px-6 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all border border-white/5"
                >
                  Discard & Retake
                </button>
                <button 
                  onClick={mergeAndSave}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:from-emerald-500 transition-all active:scale-95 text-center"
                >
                  Complete Verification
                </button>
               </>
             )}
          </div>
        </div>

        {/* Sidebar Instructions */}
        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Audit Requirements</h3>
            <ul className="space-y-4">
              {[
                { label: 'Clear facial visibility', status: photo ? 'complete' : 'pending' },
                { label: 'Neutral background', status: 'optional' },
                { label: 'Digital signature on-screen', status: photo ? 'pending' : 'awaiting' },
                { label: 'GPS Geofence match', status: 'complete' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    item.status === 'complete' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700'
                  }`}>
                    {item.status === 'complete' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                  </div>
                  <span className={`text-sm font-bold ${item.status === 'complete' ? 'text-white' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-600/20 to-purple-600/10 border border-primary-500/20 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-white font-black mb-2 italic">Engineering Note</h3>
               <p className="text-xs text-slate-300 leading-relaxed font-medium">
                 This module utilizes the Native MediaDevices API with a signature overlay merged programmatically into a PNG blob for persistent audit trailing.
               </p>
             </div>
             <div className="absolute top-[-20px] right-[-20px] opacity-10">
               <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
               </svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
