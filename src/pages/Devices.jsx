import { useOutletContext, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Search,
  Pencil,
  RefreshCw,
  Cpu,
  Zap,
  Snowflake,
  Tv,
  Fan,
} from 'lucide-react';
import { useState } from 'react';
import { mockHome } from '../data/mockData.js';

const iconFor = name => {
  const n = name.toLowerCase();
  if (n.includes('ac') || n.includes('cool')) return Snowflake;
  if (n.includes('tv')) return Tv;
  if (n.includes('plug')) return Cpu;
  if (n.includes('cooler')) return Fan;
  return Zap;
};

export default function Devices() {
  const { pro, activeColor } = useOutletContext();
  const [devices, setDevices] = useState(mockHome.devices);
  const [searchingId, setSearchingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const unknown = devices.filter(d => !d.identified);
  const guesses = devices.filter(d => d.identified && !d.verified);
  const verified = devices.filter(d => d.identified && d.verified);

  const searchOnline = d => {
    setSearchingId(d.id);
    setTimeout(() => {
      setDevices(prev =>
        prev.map(x => (x.id === d.id ? { ...x, identified: true, verified: true, name: d.name.replace(' (unknown)', ' — Water Heater') } : x))
      );
      setSearchingId(null);
    }, 1800);
  };

  const startEdit = d => {
    setEditingId(d.id);
    setEditName(d.name);
  };
  const saveEdit = id => {
    setDevices(prev => prev.map(x => (x.id === id ? { ...x, name: editName, identified: true, verified: true } : x)));
    setEditingId(null);
  };

  const Card = ({ d, action }) => (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeColor} bg-white/5`}>
            {action === 'unknown' || action === 'searching' ? (
              <Cpu className="w-5 h-5" />
            ) : (
              <Icon d={d} />
            )}
          </div>
          <div className="min-w-0">
            {editingId === d.id ? (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveEdit(d.id)}
                autoFocus
                className="bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-sm outline-none w-full"
              />
            ) : (
              <Link to={`/device/${d.id}`} className="font-semibold text-[14px] hover:underline">
                {d.name}
              </Link>
            )}
            <p className="text-xs text-slate-500">{d.room}</p>
          </div>
        </div>
        {d.identified && !editingId && (
          <button onClick={() => startEdit(d)} className="text-slate-500 hover:text-white transition-colors p-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className={`text-sm font-semibold text-slate-400`}>
          <span className="text-base font-bold text-white">₹{d.monthCost.toLocaleString('en-IN')}</span>
          <span className="text-[11px]"> /mo</span>
        </p>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
            action === 'verified'
              ? 'bg-emerald-500/15 text-emerald-300'
              : action === 'guess'
                ? 'bg-amber-500/15 text-amber-300'
                : 'bg-rose-500/15 text-rose-300'
          }`}
        >
          {action === 'verified' && 'AI verified'}
          {action === 'guess' && 'AI guess — needs you'}
          {action === 'unknown' && 'Unidentified'}
        </span>
      </div>

      {action !== 'verified' && (
        <div className="flex items-center gap-2">
          {action === 'guess' && (
            <>
              <button
                onClick={() =>
                  setDevices(prev => prev.map(x => (x.id === d.id ? { ...x, verified: true } : x)))
                }
                className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold bg-emerald-500/80 hover:bg-emerald-400 text-white rounded-xl py-2 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
              </button>
              <button
                onClick={() => startEdit(d)}
                className="flex items-center justify-center gap-1.5 text-[12px] font-bold glass-button rounded-xl px-3 py-2"
              >
                <Pencil className="w-3 h-3" /> Correct
              </button>
            </>
          )}
          {action === 'unknown' &&
            (searchingId === d.id ? (
              <div className="flex-1 flex items-center justify-center gap-2 text-[12px] text-slate-300 glass-button rounded-xl py-2">
                <Search className="w-3.5 h-3.5 animate-pulse" /> Searching specs online…
              </div>
            ) : (
              <button
                onClick={() => searchOnline(d)}
                className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-bold bg-rose-500 hover:bg-rose-400 text-white rounded-xl py-2 transition-all"
              >
                <Search className="w-3.5 h-3.5" /> Identify with AI
              </button>
            ))}
        </div>
      )}

      {action === 'unknown' && !searchingId && (
        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
          Usage pattern: {d.pattern}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Devices & AI identification</h1>
          <p className="text-sm text-slate-400 mt-1">
            Imported from Home Assistant. The AI studies usage patterns, then verifies specs online — you have the final say.
          </p>
        </div>
        <button className="glass-button rounded-xl p-2.5 shrink-0" title="Re-scan">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {unknown.length > 0 && (
        <section className="mb-7">
          <h2 className={`text-sm font-semibold mb-3 uppercase tracking-widest ${activeColor}`}>
            <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" /> Needs AI identification ({unknown.length})
          </h2>
          <div className="grid gap-4">{unknown.map(d => <Card key={d.id} d={d} action="unknown" />)}</div>
        </section>
      )}

      {guesses.length > 0 && (
        <section className="mb-7">
          <h2 className={`text-sm font-semibold mb-3 uppercase tracking-widest ${activeColor}`}>
            Needs your confirmation ({guesses.length})
          </h2>
          <div className="grid gap-4">{guesses.map(d => <Card key={d.id} d={d} action="guess" />)}</div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Identified & verified ({verified.length})
        </h2>
        <div className="grid gap-4">{verified.map(d => <Card key={d.id} d={d} action="verified" />)}</div>
      </section>
    </div>
  );

  function Icon({ d }) {
    const I = iconFor(d.name);
    return <I className="w-5 h-5" />;
  }
}