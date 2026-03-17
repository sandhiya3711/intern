import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { generateMockData } from '../utils/mockData';

// Fix for default marker icon in React-Leaflet using CDN links to avoid 500 error with asset imports
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CITY_COORDS = {
  "Mumbai": [19.0760, 72.8777], "Delhi": [28.6139, 77.2090], "Bangalore": [12.9716, 77.5946],
  "Hyderabad": [17.3850, 78.4867], "Ahmedabad": [23.0225, 72.5714], "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639], "Pune": [18.5204, 73.8567], "Jaipur": [26.9124, 75.7873],
  "Surat": [21.1702, 72.8311], "Indore": [22.7196, 75.8577], "Bhopal": [23.2599, 77.4126],
  "Vadodara": [22.3072, 73.1812], "Ludhiana": [30.9010, 75.8573], "Agra": [27.1767, 78.0081],
  "Nashik": [19.9975, 73.7898], "Faridabad": [28.4089, 77.3178], "Meerut": [28.9845, 77.7064],
  "Rajkot": [22.3039, 70.8022], "Kalyan": [19.2403, 73.1305], "Vasai": [19.3917, 72.8397],
  "Varanasi": [25.3176, 82.9739], "Srinagar": [34.0837, 74.7973], "Aurangabad": [19.8762, 75.3433],
  "Dhanbad": [23.7957, 86.4304], "Amritsar": [31.6340, 74.8723], "Navi Mumbai": [19.0330, 73.0297],
  "Allahabad": [25.4358, 81.8463], "Ranchi": [23.3441, 85.3096], "Howrah": [22.5958, 88.2636]
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [auditImage, setAuditImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

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
          setData(generateMockData(1000));
          setIsUsingMock(true);
        }
      } catch (error) {
        console.error('Error fetching analytics data, using fallback:', error);
        setData(generateMockData(1000));
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Find latest audit image
    const lastAuditId = localStorage.getItem('last_audit_id');
    const image = localStorage.getItem(`audit_image_${lastAuditId}`);
    if (image) {
      setAuditImage(image);
    } else {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('audit_image_'));
      if (keys.length > 0) {
        setAuditImage(localStorage.getItem(keys[keys.length - 1]));
      }
    }
  }, []);

  const chartData = useMemo(() => {
    const cityMap = {};
    data.forEach(item => {
      if (!cityMap[item.city]) {
        cityMap[item.city] = { name: item.city, totalSalary: 0, count: 0 };
      }
      cityMap[item.city].totalSalary += Number(item.salary);
      cityMap[item.city].count += 1;
    });
    
    return Object.values(cityMap)
      .map(city => ({
        ...city,
        avgSalary: city.totalSalary / city.count
      }))
      .sort((a, b) => b.avgSalary - a.avgSalary)
      .slice(0, 8); // Top 8 cities
  }, [data]);

  const maxAvgSalary = Math.max(...chartData.map(c => c.avgSalary), 1);

  if (loading) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
          <div className="w-20 h-20 border-t-rose-500 border-r-rose-500 border-4 border-slate-900 rounded-full animate-spin"></div>
          <p className="text-rose-500 font-black tracking-widest uppercase animate-pulse">Analyzing Workforce Metrics...</p>
       </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Systems <span className="gradient-text">Intelligence</span></h1>
          <p className="text-slate-400 font-bold text-lg max-w-xl">Deep analytics and geospatial distribution of the global workforce.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 glass-card rounded-3xl border-white/5 flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Status</p>
              <p className="text-xs font-black text-white uppercase">{isUsingMock ? 'Simulation Active' : 'Real-time Stream'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Audit Visualization */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                Recent Audit Capture
              </h2>
              <div className="relative aspect-square bg-slate-950 rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center">
                {auditImage ? (
                  <img src={auditImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Audit Blob" />
                ) : (
                  <div className="text-center p-10">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
                      <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      </svg>
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-relaxed">Secure data link awaiting <br/> hardware initialization</p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-between items-center text-[10px] font-black text-slate-600 border-t border-white/5 pt-8 uppercase tracking-widest">
                 <span>Latency: 0.4ms</span>
                 <span>Integrity: 100%</span>
              </div>
           </div>
        </div>

        {/* Right Col: High-End SVG Dashboard */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="glass-card rounded-[3rem] p-12 border border-white/10 shadow-2xl flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-16">
                 <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                      Salary Compensation Matrix
                    </h2>
                    <p className="text-2xl font-black text-white tracking-widest uppercase">Benchmark Analytics</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Payload</p>
                    <p className="text-3xl font-black text-white tabular-nums">${Math.round(data.reduce((a,b)=>a+Number(b.salary),0)/1000000)}M</p>
                 </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-6 px-4 relative min-h-[300px]">
                 {/* Decorative Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between py-2 border-l border-white/5">
                    {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-white/[0.03]"></div>)}
                 </div>

                 {chartData.map((city) => {
                   const height = (city.avgSalary / maxAvgSalary) * 95;
                   return (
                     <div key={city.name} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="absolute bottom-full mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 pointer-events-none z-30">
                           <div className="bg-white text-slate-950 px-4 py-2 rounded-[1rem] text-[10px] font-black shadow-2xl uppercase tracking-widest">
                              ${Math.round(city.avgSalary).toLocaleString()}
                           </div>
                           <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1"></div>
                        </div>

                        <div 
                          className="w-full max-w-[50px] rounded-t-3xl bg-gradient-to-t from-primary-600 to-primary-400 group-hover:from-rose-500 group-hover:to-pink-400 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_30px_rgba(14,165,233,0.15)] group-hover:shadow-[0_0_50px_rgba(244,63,94,0.3)] relative overflow-hidden"
                          style={{ height: `${height}%` }}
                        >
                           <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-white transition-colors truncate w-full text-center">
                           {city.name}
                        </p>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      </div>

      {/* Full Width Map: Industrial Dark Mode */}
      <div className="glass-card rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden min-h-[600px] flex flex-col group relative">
        <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
           <div className="glass px-6 py-3 rounded-2xl border border-white/10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Workforce Topology
              </h2>
              <p className="text-white font-black text-xs uppercase tracking-widest">Global Density Map</p>
           </div>
        </div>

        <div className="flex-1 grayscale-[0.8] contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 relative z-0">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            {Object.entries(CITY_COORDS).map(([name, coords]) => {
              const cityEmpCount = data.filter(d => d.city === name).length;
              if (cityEmpCount === 0) return null;
              return (
                <Marker key={name} position={coords}>
                  <Popup className="premium-popup">
                    <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl">
                       <h4 className="text-white font-black text-sm mb-2 uppercase tracking-widest">{name}</h4>
                       <div className="flex items-center gap-3 text-xs font-bold text-slate-400 border-t border-white/5 pt-3">
                          <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                          {cityEmpCount.toLocaleString()} EMPLOYEES
                       </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
