import { Power, Wifi } from 'lucide-react';

export default function CostHeader({ pro, setPro, accent, accentBg, glowClass, totalWatts, totalCostToday, simEnabled, setSimEnabled }) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl ${accentBg} ${glowClass} flex items-center justify-center shadow-lg transition-all duration-300`}>
            <img src="/lattice-mark.svg" alt="LATTICE" className="w-6 h-6" draggable="false" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none">LATTICE</h1>
            <p className="text-[11px] text-[#94A3B8] tracking-widest uppercase">Smart Energy Monitor</p>
          </div>
        </div>
        <button
          onClick={() => setPro(p => !p)}
          className={`glass-button flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
            pro ? 'text-sky-300 border-sky-400/30' : 'text-[#F8FAFC]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${pro ? 'bg-sky-400' : 'bg-[#64748B]'}`} />
          {pro ? 'PRO ACTIVE' : 'TRY PRO (FREE)'}
        </button>
      </div>

      {/* Live total card */}
      <div className={`glass-panel rounded-3xl p-6 ${pro ? 'glass-panel-pro' : ''}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-[#94A3B8] mb-2">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${simEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                LIVE
              </span>
              {homeHubBadge(pro)}
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="hidden sm:inline">Home Assistant</span>
            </div>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-base font-semibold text-[#64748B] align-top mr-1">₹</span>
              {totalCostToday.toLocaleString('en-IN')}
              <span className="text-xl font-semibold text-[#94A3B8]"> today</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-button rounded-2xl px-4 py-3 text-center">
              <p className={`text-lg font-bold ${accent}`}><span className="text-xs">≈</span>{monthlyEstimate()}</p>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">est. month</p>
            </div>
            <div className="glass-button rounded-2xl px-4 py-3 text-center">
              <p className="text-lg font-bold text-emerald-300">{totalWatts.toLocaleString('en-IN')}<span className="text-xs text-[#94A3B8]"> W</span></p>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest">drawing now</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSimEnabled(s => !s)}
            className="glass-button flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          >
            <Power className="w-3.5 h-3.5" />
            {simEnabled ? 'Pause live simulation' : 'Resume live simulation'}
          </button>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5" /> Live values are simulated for this demo.
          </span>
        </div>
      </div>
    </header>
  );

  function homeHubBadge(isPro) {
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isPro ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'}`}>
        HOME
      </span>
    );
  }

  function monthlyEstimate() {
    const monthly = totalCostToday * 30;
    return Math.round(monthly).toLocaleString('en-IN');
  }
}