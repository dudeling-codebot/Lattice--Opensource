import { useState, useEffect } from 'react';
import { Zap, Bolt, Shield } from 'lucide-react';
import { mockHome } from './mockData.js';
import PowerFlow from './components/PowerFlow.jsx';
import RoomCard from './components/RoomCard.jsx';
import DeviceCard from './components/DeviceCard.jsx';
import CostHeader from './components/CostHeader.jsx';

export default function App() {
  const [home, setHome] = useState(mockHome);
  const [pro, setPro] = useState(false);
  const [simEnabled, setSimEnabled] = useState(true);

  useEffect(() => {
    if (!simEnabled) return;
    const interval = setInterval(() => {
      setHome(prev => ({
        ...prev,
        devices: prev.devices.map(d => ({
          ...d,
          currentWatts: Math.max(2, Math.round(d.baseWatts * (0.62 + Math.random() * 0.7))),
        })),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [simEnabled]);

  const accent = pro ? 'text-sky-400' : 'text-rose-400';
  const accentBg = pro ? 'bg-sky-500' : 'bg-rose-500';
  const glowClass = pro ? 'glow-blue' : 'glow-magenta';

  const totalWatts = home.devices.reduce((s, d) => s + d.currentWatts, 0);
  const totalCostToday = home.devices.reduce((s, d) => s + d.todayCost, 0);

  const ranking = [...home.devices].sort((a, b) => b.monthCost - a.monthCost).slice(0, 3);

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <div className="fixed inset-0 bg-lattice-grid pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)' }} />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)' }} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <CostHeader
          pro={pro}
          setPro={setPro}
          accent={accent}
          accentBg={accentBg}
          glowClass={glowClass}
          totalWatts={totalWatts}
          totalCostToday={totalCostToday}
          simEnabled={simEnabled}
          setSimEnabled={setSimEnabled}
        />

        {home.hubConnected && (
          <PowerFlow
            accent={accent}
            accentBg={accentBg}
            glowClass={glowClass}
            rooms={home.rooms}
            devices={home.devices}
            totalWatts={totalWatts}
          />
        )}

        {pro && (
          <div className={`glass-panel-pro mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl`}>
            <Shield className="w-5 h-5 text-sky-400" />
            <p className="text-sm text-sky-100">
              <span className="font-semibold text-white">PRO account</span> — Electric Blue mode active. Enjoy your LATTICE PRO perks.
            </p>
          </div>
        )}

        {ranking.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
              Energy Hogs — This Month
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ranking.map((d, i) => (
                <div key={d.id} className="glass-panel rounded-2xl p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${pro ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'} flex items-center justify-center`}>
                    {i === 0 ? <Bolt className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className={`text-lg font-bold ${accent}`}>₹{d.monthCost.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-[#94A3B8]">{d.room} · {d.currentWatts} W live</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
            Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {home.rooms.map(r => (
              <RoomCard key={r.id} room={r} accent={accent} pro={pro} />
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
            Appliances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {home.devices.map(d => (
              <DeviceCard
                key={d.id}
                device={d}
                accent={accent}
                accentBg={accentBg}
                glowClass={glowClass}
                pro={pro}
              />
            ))}
          </div>
        </div>

        <footer className="text-center text-xs text-[#475569] py-8">
          LATTICE — Connecting Ideas. Building Solutions.<br />
          Simulated live data · Home Assistant integration & AI identification coming soon.
        </footer>
      </main>
    </div>
  );
}