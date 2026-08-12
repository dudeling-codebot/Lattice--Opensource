import { Home, Wifi, WifiOff } from 'lucide-react';

export default function RoomCard({ room, devices, activeColor }) {
  const roomDevices = devices.filter(d => d.room === room.name);
  const watts = roomDevices.reduce((s, d) => s + d.currentWatts, 0);
  const monthCost = roomDevices.reduce((s, d) => s + d.monthCost, 0);
  const active = watts > 0;

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${activeColor} bg-white/5 flex items-center justify-center`}>
          <Home className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] truncate">{room.name}</p>
          <p className="text-xs text-slate-500">
            {roomDevices.length} appliance{roomDevices.length === 1 ? '' : 's'}
          </p>
        </div>
        {roomDevices.length > 0 ? <Wifi className={`w-4 h-4 ${activeColor}`} /> : <WifiOff className="w-4 h-4 text-slate-700" />}
      </div>
      <div className="flex items-center justify-between text-[12px]">
        <span className={`font-mono ${active ? activeColor : 'text-slate-600'}`}>
          {watts > 0 ? `${watts} W live` : 'idle'}
        </span>
        <span className="text-slate-400 font-semibold">₹{monthCost.toLocaleString('en-IN')}/mo</span>
      </div>
    </div>
  );
}