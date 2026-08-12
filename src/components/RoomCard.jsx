import { Home, Wifi, WifiOff } from 'lucide-react';

export default function RoomCard({ room, accent, pro }) {
  const deviceCount = room.devices.length;

  return (
    <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${pro ? 'bg-sky-500/15 text-sky-300' : 'bg-rose-500/15 text-rose-300'} flex items-center justify-center`}>
        <Home className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[15px] truncate">{room.name}</p>
        <p className="text-xs text-[#94A3B8]">{deviceCount} appliance{deviceCount === 1 ? '' : 's'}</p>
      </div>
      <div className="flex items-center gap-1.5">
        {deviceCount > 0 ? (
          <Wifi className={`w-4 h-4 ${accent}`} />
        ) : (
          <WifiOff className="w-4 h-4 text-slate-600" />
        )}
      </div>
    </div>
  );
}