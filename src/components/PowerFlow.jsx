import { Home, Activity, ArrowDown } from 'lucide-react';

export default function PowerFlow({ activeColor, rooms, devices, totalWatts }) {
  const accentBg = activeColor.includes('sky') ? 'bg-sky-500' : 'bg-rose-500';
  const glowClass = activeColor.includes('sky') ? 'glow-blue' : 'glow-magenta';

  return (
    <div className="glass-panel rounded-3xl p-5 mb-7">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Electricity Flow — Live
        </p>
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${activeColor}`}>
          <Activity className="w-3.5 h-3.5" />
          {totalWatts.toLocaleString('en-IN')} W
        </span>
      </div>

      <div className="relative rounded-2xl border border-white/5 bg-black/20 p-4 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-4 justify-center min-w-[560px]">
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl ${accentBg} ${glowClass} flex items-center justify-center shadow-lg transition-all duration-500`}>
              <Home className="w-7 h-7 text-white" />
            </div>
            <p className="text-[11px] font-semibold mt-2 text-white">Main Meter</p>
            <p className={`text-[10px] font-mono ${activeColor}`}>{totalWatts} W</p>
          </div>

          <div className="flex flex-col items-center self-start mt-8">
            <ArrowDown className={`w-4 h-4 ${activeColor} -mb-1`} />
            <div className="w-20 h-0.5 my-3 relative overflow-hidden">
              <div className={`absolute inset-y-0 left-0 w-1/3 ${accentBg} animate-pulse-glow`} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-start justify-center max-w-3xl">
            {rooms.map(room => {
              const roomDevices = devices.filter(d => d.room === room.name);
              const roomWatts = roomDevices.reduce((s, d) => s + d.currentWatts, 0);
              const active = roomWatts > 0;
              return (
                <div key={room.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        active ? `border-transparent ${accentBg} ${glowClass}` : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <Home className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <p className="text-[11px] font-medium mt-1.5 text-white">{room.name}</p>
                    <p className={`text-[10px] font-mono ${active ? activeColor : 'text-slate-600'}`}>
                      {roomWatts > 0 ? `${roomWatts} W` : 'idle'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {roomDevices.map(d => {
                      const on = d.currentWatts > 0;
                      return (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <div className="w-4 h-0.5 relative overflow-hidden rounded">
                            <div
                              className={`absolute inset-y-0 left-0 w-1/2 rounded transition-all duration-700 ${
                                on ? `${accentBg} animate-pulse-glow` : 'bg-white/10'
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2 py-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${on ? accentBg : 'bg-slate-700'}`} />
                            <span className="text-[10px] text-slate-300">{d.name.split(' — ')[0]}</span>
                            <span className={`text-[10px] font-mono ${on ? activeColor : 'text-slate-600'}`}>
                              {d.currentWatts}W
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 mt-3">
        Node map reflects real-time power drawn by each connected Home Assistant device.
      </p>
    </div>
  );
}