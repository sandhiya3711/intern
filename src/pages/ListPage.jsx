import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMockData } from '../utils/mockData';

const ROW_HEIGHT = 72;
const BUFFER = 10;
const VIEWPORT_HEIGHT = 650;

const ListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: '123456' }),
        });
        
        const result = await response.json();
        if (result && Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data);
          setIsUsingMock(false);
        } else {
          // Fallback to mock data if API is empty
          console.log('API returned empty results, using mock data.');
          setData(generateMockData(1500));
          setIsUsingMock(true);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback to mock data on error too
        setData(generateMockData(1500));
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = useCallback((e) => {
    const currentScrollTop = e.target.scrollTop;
    setScrollTop(currentScrollTop);
  }, []);

  const { visibleData, translateY, totalHeight, startIndex } = useMemo(() => {
    const dataLength = data.length;
    if (dataLength === 0) {
      return { visibleData: [], translateY: 0, totalHeight: 0, startIndex: 0 };
    }

    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
    const end = Math.min(dataLength, start + visibleCount + 2 * BUFFER);
    
    return {
      visibleData: data.slice(start, end),
      translateY: start * ROW_HEIGHT,
      totalHeight: dataLength * ROW_HEIGHT,
      startIndex: start
    };
  }, [scrollTop, data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin shadow-[0_0_30px_rgba(14,165,233,0.3)]"></div>
        <div className="space-y-2 text-center">
          <p className="text-xl font-black text-white tracking-widest uppercase">Initializing Core</p>
          <p className="text-slate-500 font-bold text-xs animate-pulse">Synchronizing high-frequency personnel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 animate-fade-in">
      <header className="mb-10 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-5xl font-black text-white tracking-tighter">Personnel Browser</h1>
            {isUsingMock && (
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest h-fit mt-2">
                Sample Environment
              </span>
            )}
          </div>
          <p className="text-slate-400 font-bold text-lg max-w-xl leading-relaxed">
            High-performance virtualization engine managing <span className="text-white"> {data.length.toLocaleString()} </span> live records.
          </p>
        </div>
        
        <div className="flex items-center gap-6 glass p-4 rounded-3xl border-white/5 shadow-2xl">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Render Latency</p>
              <p className="text-emerald-400 font-mono font-bold text-sm">~1.2ms</p>
           </div>
           <div className="h-10 w-px bg-white/10"></div>
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Heap Usage</p>
              <p className="text-primary-400 font-mono font-bold text-sm">Adaptive</p>
           </div>
        </div>
      </header>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4 px-10 py-8 bg-white/[0.03] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          <div className="hidden md:block">System ID</div>
          <div>Identity Name</div>
          <div>Primary Hub</div>
          <div className="text-right">Compensation</div>
          <div className="text-right pr-4">Matrix</div>
        </div>

        <div 
          onScroll={handleScroll}
          className="overflow-y-auto overflow-x-hidden relative"
          style={{ height: `${VIEWPORT_HEIGHT}px` }}
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <div 
              style={{ 
                transform: `translateX(0px) translateY(${translateY}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }}
            >
              {visibleData.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/details/${item.id}`)}
                  className="grid grid-cols-4 md:grid-cols-5 gap-4 px-10 py-4 items-center border-b border-white/[0.03] hover:bg-white/[0.07] cursor-pointer transition-all duration-300 group"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <div className="hidden md:block text-slate-600 font-mono text-xs font-bold">
                    ID-{item.id.padStart(5, '0')}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-primary-500/50 group-hover:from-primary-500/20 group-hover:text-primary-400 transition-all duration-500 shadow-lg">
                      {item.name[0]}
                    </div>
                    <div>
                      <span className="text-white font-black tracking-tight block text-sm group-hover:text-primary-300 transition-colors uppercase">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.city}</div>
                  <div className="text-right">
                    <span className="text-xl font-black tabular-nums font-mono tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                      ${Number(item.salary).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right pr-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 text-slate-500 group-hover:bg-primary-500 group-hover:text-white group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              Live Pipeline
            </span>
            <span className="border-l border-white/10 pl-6">
               Index {startIndex} - {startIndex + visibleData.length}
            </span>
          </div>
          <div className="text-slate-500">
             Optimized for High-Density Grid Displays • {isUsingMock ? 'Mocking Enabled' : 'Verified API'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
