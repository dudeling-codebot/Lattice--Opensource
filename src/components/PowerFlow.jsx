import { Home, Activity, ArrowDown } from 'lucide-react';

export default function PowerFlow({ accent, accentBg, glowClass, rooms, devices, totalWatts }) {
  const liveDevices = devices.filter(d => d.currentWatts > 0);

  return (
    <div className="glass-panel rounded-3xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
          Electricity Flow — Live
        </p>
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${accent}`}>
          <Activity className="w-3.5 h-3.5" />
          {totalWatts.toLocaleString('en-IN')} W
        </span>
      </div>

      <div className="relative rounded-2xl border border-white/5 bg-black/20 p-4 overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-4 justify-center min-w-[560px]">
          {/* Meter */}
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl ${accentBg} ${glowClass} flex items-center justify-center shadow-lg`}>
              <Home className="w-7 h-7 text-white" />
            </div>
            <p className="text-[11px] font-semibold mt-2 text-[#F8FAFC]">Main Meter</p>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center self-start mt-8">
            <ArrowDown className={`w-4 h-4 ${accent} -mb-1`} />
            <div className="w-20 h-0.5 my-3 relative overflow-hidden" >
              <div className={`absolute inset-y-0 left-0 w-1/3 ${accentBg} animate-pulse-glow`} />
            </div>
          </div>

          {/* Rooms grid */}
          <div className="flex flex-wrap gap-4 items-start justify-center max-w-3xl">
            {rooms.map(room => {
              const roomDevices = devices.filter(d => d.room === room.name);
              const roomWatts = roomDevices.reduce((s, d) => s + d.currentWatts, 0);
              const active = roomWatts > 0;
              return (
                <div key={room.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                      active
                        ? `border-transparent ${accentBg} ${glowClass}`
                        : 'border-white/10 bg-white/5'
                    }`}>
                      <Home className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <p className="text-[11px] font-medium mt-1.5 text-[#F8FAFC]">{room.name}</p>
                    <p className={`text-[10px] font-mono ${active ? accent : 'text-slate-500'}`}>
                      {roomWatts > 0 ? `${roomWatts} W` : 'idle'}
                    </p>
                  </div>

                  {/* Small node connectors to appliances */}
                  <div className="flex flex-col gap-2">
                    {roomDevices.map(d => {
                      const on = d.currentWatts > 0;
                      return (
                        <div key={d.id} className="flex items-center gap-1.5">
                          <div className="w-4 h-0.5 relative overflow-hidden rounded">
                            <div className={`absolute inset-y-0 left-0 w-1/2 ${on ? accentBg : 'bg-white/10'} ${on ? 'animate-pulse-glow' : ''}`} />
                          </div>
                          <div key={d.id} className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2 py-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${on ? accentBg : 'bg-slate-600'} animate-pulse-glow`} />
                            <span className="text-[10px] text-[#CBD5E1]">{d.name.split(' — ')[0]}</span>
                            {on && <span className="text-[10px] font-mono text-slate-400">{d.currentWatts}W</span>}
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

      <p className="text-[11px] text-[#64748B] mt-3">
        Node map reflects real-time power drawn by each connected Home Assistant device.
      </p>
    </div>
  );
}