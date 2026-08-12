import { Link } from 'react-router-dom';
import { Zap, BadgeCheck, Cpu, Wrench } from 'lucide-react';

export default function DeviceCard({ device, activeColor, glowClass }) {
  const running = device.currentWatts > 0;
  const accentBg = activeColor.includes('sky') ? 'bg-sky-500' : 'bg-rose-500';

  return (
    <Link to={`/device/${device.id}`} className="glass-panel rounded-2xl p-4 block hover:border-white/25 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
              running ? `${accentBg} ${glowClass}` : 'bg-white/5 text-slate-500'
            }`}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[14px] truncate">{device.name}</p>
            <p className="text-xs text-slate-500">{device.room}</p>
          </div>
        </div>
        <span className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-400 animate-pulse-glow' : 'bg-slate-700'}`} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-xl font-bold ${activeColor}`}>
            ₹{device.todayCost}
            <span className="text-xs font-medium text-slate-600"> /day</span>
          </p>
          <p className="text-xs text-slate-500">₹{device.monthCost.toLocaleString('en-IN')}/month</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono font-bold text-white">
            {device.currentWatts.toLocaleString('en-IN')}
            <span className="text-[10px] text-slate-500"> W</span>
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
            {device.status === 'paused' ? 'paused' : running ? 'running' : 'off'}
          </p>
        </div>
      </div>

      <div className="w-full h-1.5 rounded-full bg-white/5 mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${running ? accentBg : 'bg-white/10'}`}
          style={{ width: `${Math.min(100, Math.round((device.monthCost / 1850) * 100))}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {device.identified ? (
            <span className={`flex items-center gap-1 text-[10px] ${device.verified ? 'text-emerald-300' : 'text-amber-300'}`}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {device.verified ? 'AI verified' : 'AI guess'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-rose-300">
              <Cpu className="w-3.5 h-3.5" /> identifying…
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <Wrench className="w-3 h-3" /> Details
        </span>
      </div>
    </Link>
  );
}