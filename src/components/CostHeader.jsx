import { useOutletContext } from 'react-router-dom';
import { Power, Wifi, Shield, TrendingUp } from 'lucide-react';

export default function CostHeader({ home, pro, activeColor, glowClass, totalWatts, totalToday, totalMonth, paused, setPaused }) {
  return (
    <header className="mb-6">
      <div className={`glass-panel rounded-3xl p-6 ${pro ? 'glass-panel-pro' : ''} transition-all duration-500`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${paused ? 'bg-slate-600' : 'bg-emerald-400 animate-pulse'}`} />
                {paused ? 'PAUSED' : 'LIVE'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="hidden sm:inline">{home.name}</span>
              <span className="text-slate-600">·</span>
              <span>Home Assistant</span>
            </div>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-base font-semibold text-slate-500 align-top mr-1">₹</span>
              {totalToday.toLocaleString('en-IN')}
              <span className="text-xl font-semibold text-slate-400"> today</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-button rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <p className={`text-lg font-bold ${activeColor}`}>
                <span className="text-xs">≈</span>
                ₹{Math.round(totalMonth).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">est. month</p>
            </div>
            <div className="glass-button rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <p className="text-lg font-bold text-emerald-300">
                {totalWatts.toLocaleString('en-IN')}
                <span className="text-xs text-slate-500"> W</span>
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">drawing now</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPaused(p => !p)}
            className="glass-button flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          >
            <Power className="w-3.5 h-3.5" />
            {paused ? 'Resume live simulation' : 'Pause live simulation'}
          </button>
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" /> Live values are simulated for this demo.
          </span>
          {pro && (
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-sky-300">
              <Shield className="w-3.5 h-3.5" /> PRO mode
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}