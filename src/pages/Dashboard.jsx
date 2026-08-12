import { useOutletContext, Link } from 'react-router-dom';
import { Zap, Bolt, Activity, Power } from 'lucide-react';
import { useEnergySim } from '../hooks/useEnergySim.js';
import { mockHome } from '../data/mockData.js';
import PowerFlow from '../components/PowerFlow.jsx';
import CostHeader from '../components/CostHeader.jsx';
import RoomCard from '../components/RoomCard.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import { useEffect } from 'react';

export default function Dashboard() {
  const { pro, activeColor, glowClass } = useOutletContext();
  const sim = useEnergySim(mockHome.devices);

  useEffect(() => {
    sim.setPaused(false);
  }, []);

  const ranking = [...sim.devices]
    .filter(d => d.monthCost > 0)
    .sort((a, b) => b.monthCost - a.monthCost)
    .slice(0, 3);

  return (
    <>
      <CostHeader
        home={mockHome}
        pro={pro}
        activeColor={activeColor}
        glowClass={glowClass}
        totalWatts={sim.totalWatts}
        totalToday={sim.totalToday}
        totalMonth={sim.totalMonth}
        paused={sim.paused}
        setPaused={sim.setPaused}
      />

      <PowerFlow
        activeColor={activeColor}
        rooms={mockHome.rooms}
        devices={sim.devices}
        totalWatts={sim.totalWatts}
      />

      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Energy Hogs — This Month
          </h2>
          <Link to="/devices" className={`text-xs font-semibold ${activeColor}`}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ranking.map((d, i) => (
            <div key={d.id} className="glass-panel rounded-2xl p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${activeColor} bg-white/5 flex items-center justify-center`}>
                {i === 0 ? <Bolt className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <p className={`text-lg font-bold ${activeColor}`}>
                  ₹{d.monthCost.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {d.currentWatts} W live
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockHome.rooms.map(r => (
            <RoomCard key={r.id} room={r} devices={sim.devices} activeColor={activeColor} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Appliances <span className="text-slate-600 normal-case">· tap one for details</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sim.devices.map(d => (
            <DeviceCard key={d.id} device={d} activeColor={activeColor} glowClass={glowClass} />
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-slate-600 py-8">
        LATTICE — Connecting Ideas. Building Solutions.
        <br />
        Simulated live data · Home Assistant + AI identification flow in the other pages.
      </footer>
    </>
  );
}