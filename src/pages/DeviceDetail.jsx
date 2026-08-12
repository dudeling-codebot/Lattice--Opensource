import { useParams, Link, useOutletContext } from 'react-router-dom';
import { BadgeCheck, Cpu, Pencil, Clock, IndianRupee, Zap, ArrowLeft } from 'lucide-react';
import { useEnergySim } from '../hooks/useEnergySim.js';
import { mockHome, dailyProfile } from '../data/mockData.js';

export default function DeviceDetail() {
  const { id } = useParams();
  const { pro, activeColor, glowClass } = useOutletContext();
  const sim = useEnergySim(mockHome.devices);
  const device = sim.devices.find(d => d.id === id);

  if (!device) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4">Device not found.</p>
        <Link to="/devices" className={`font-semibold ${activeColor}`}>← Back to devices</Link>
      </div>
    );
  }

  const hours = dailyProfile(device, device.id.charCodeAt(1) % 40);
  const maxW = Math.max(...hours.map(h => h.watts), 1);
  const todayUsed = hours.reduce((s, h) => s + h.watts, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/devices" className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-white mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to devices
      </Link>

      <div className="glass-panel rounded-3xl p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${activeColor} ${glowClass} bg-white/5 flex items-center justify-center shrink-0`}>
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight">{device.name}</h1>
            <p className="text-sm text-slate-400 mb-2">{device.room}</p>
            <div className="flex flex-wrap gap-2">
              {device.verified ? (
                <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/15 text-emerald-300 px-2 py-1 rounded-lg">
                  <BadgeCheck className="w-3.5 h-3.5" /> AI verified spec
                </span>
              ) : device.identified ? (
                <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-500/15 text-amber-300 px-2 py-1 rounded-lg">
                  AI guess — confirm on Devices page
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold bg-rose-500/15 text-rose-300 px-2 py-1 rounded-lg">
                  <Cpu className="w-3.5 h-3.5" /> Unidentified — run AI scan
                </span>
              )}
              <button className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white glass-button px-2 py-1 rounded-lg">
                <Pencil className="w-3 h-3" /> Edit details
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="glass-button rounded-2xl p-3 text-center">
            <p className={`text-lg font-bold ${activeColor}`}>{device.currentWatts} <span className="text-[10px] text-slate-500">W</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Live now</p>
          </div>
          <div className="glass-button rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">{Math.round(todayUsed / 100) / 10} <span className="text-[10px] text-slate-500">kWh</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Today</p>
          </div>
          <div className="glass-button rounded-2xl p-3 text-center">
            <p className={`text-lg font-bold ${activeColor}`}>₹{device.monthCost.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">This month</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Today's usage curve</h2>
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${activeColor}`}>
            <Clock className="w-3.5 h-3.5" /> 24h
          </span>
        </div>
        <div className="flex items-end gap-[3px] h-28">
          {hours.map(h => (
            <div
              key={h.hour}
              className={`flex-1 rounded-t ${h.watts > 0 ? (pro ? 'bg-sky-400/70' : 'bg-rose-400/70') : 'bg-white/5'}`}
              style={{ height: `${Math.max(4, (h.watts / maxW) * 100)}%`, transition: 'all 0.2s' }}
              title={`${h.hour}:00 — ${h.watts} W`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <IndianRupee className={`w-5 h-5 ${activeColor}`} />
          <h2 className="text-sm font-semibold text-slate-300">Cost math</h2>
        </div>
        <div className="text-[13px] space-y-2 text-slate-400">
          <p className="flex justify-between">
            <span>Usage today</span>
            <span className="font-mono text-white">{Math.round(todayUsed / 100) / 10} kWh</span>
          </p>
          <p className="flex justify-between">
            <span>Tariff</span>
            <span className="font-mono text-white">₹{mockHome.tariff} / unit</span>
          </p>
          <p className="flex justify-between border-t border-white/5 pt-2">
            <span className="text-white font-semibold">Estimated cost today</span>
            <span className={`font-mono font-bold ${activeColor}`}>≈ ₹{Math.round((todayUsed / 100) * mockHome.tariff)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}