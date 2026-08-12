import { Zap, BadgeCheck, Cpu, Pencil } from 'lucide-react';

export default function DeviceCard({ device, accent, accentBg, glowClass, pro }) {
  const on = device.status === 'on';
  const running = device.currentWatts > 0;

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            running ? `${accentBg} ${glowClass}` : 'bg-white/5 text-slate-500'
          }`}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[14px] truncate">{device.name}</p>
            <p className="text-xs text-[#94A3B8]">{device.room}</p>
          </div>
        </div>
        <span className={`w-2 h-2 rounded-full ${on ? 'bg-emerald-400 animate-pulse-glow' : 'bg-slate-600'}`} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-xl font-bold ${accent}`}>
            ₹{device.todayCost}<span className="text-xs font-medium text-[#64748B]"> /day</span>
          </p>
          <p className="text-xs text-[#94A3B8]">₹{device.monthCost.toLocaleString('en-IN')}/month</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono font-bold text-white">
            {device.currentWatts.toLocaleString('en-IN')}<span className="text-[10px] text-[#94A3B8]"> W</span>
          </p>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">
            {on ? 'running' : 'off'}
          </p>
        </div>
      </div>

      {/* Progress: share of month */}
      <div className="w-full h-1.5 rounded-full bg-white/5 mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${running ? accentBg : 'bg-white/10'}`}
          style={{ width: `${Math.min(100, Math.round((device.monthCost / 1850) * 100))}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {device.identified ? (
            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
              <BadgeCheck className={`w-3.5 h-3.5 ${device.verified ? accent : 'text-amber-400'}`} />
              {device.verified ? 'AI verified' : 'AI guess'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
              <Cpu className="w-3.5 h-3.5" /> identifying…
            </span>
          )}
        </div>
        <button className="flex items-center gap-1 text-[10px] text-[#64748B] hover:text-white transition-colors">
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
    </div>
  );
}