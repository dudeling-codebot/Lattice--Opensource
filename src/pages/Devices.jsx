import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, Search, Pencil, RefreshCw, Cpu, Zap, Snowflake, Tv, Fan, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { mockHome } from '../data/mockData.js';
import { useEnergy } from '../context/EnergyContext.jsx';

const iconFor = name => {
  const n = name.toLowerCase();
  if (n.includes('ac') || n.includes('cool')) return Snowflake;
  if (n.includes('tv')) return Tv;
  if (n.includes('plug')) return Cpu;
  if (n.includes('cooler')) return Fan;
  return Zap;
};

export default function Devices() {
  const [devices, setDevices] = useState(mockHome.devices);
  const [searchingId, setSearchingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { toggleDevice } = useEnergy();

  const unknown = devices.filter(d => !d.identified);
  const guesses = devices.filter(d => d.identified && !d.verified);
  const verified = devices.filter(d => d.identified && d.verified);

  const searchOnline = d => {
    setSearchingId(d.id);
    setTimeout(() => {
      setDevices(prev =>
        prev.map(x => (x.id === d.id ? { ...x, identified: true, verified: true, name: x.name.replace(' (unknown)', ' — Water Heater') } : x))
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

  const Row = ({ d, action }) => (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface-2)' }}>
        {action === 'unknown' ? <Cpu className="w-4 h-4 text-muted" /> : <Icon d={d} />}
      </div>

      <div className="flex-1 min-w-0">
        {editingId === d.id ? (
          <input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit(d.id)}
            autoFocus
            className="input !py-1 text-[13px] w-full"
          />
        ) : (
          <Link to={`/device/${d.id}`} className="text-[13.5px] font-semibold truncate block hover:underline">
            {d.name}
          </Link>
        )}
        <p className="text-[11px] text-faint">{d.room} · ₹{d.monthCost.toLocaleString('en-IN')}/mo</p>
      </div>

      <span
        className="chip shrink-0"
        style={
          action === 'verified'
            ? { background: 'var(--green-soft)', color: 'var(--green)' }
            : action === 'guess'
              ? { background: 'var(--amber-soft)', color: 'var(--amber)' }
              : { background: 'var(--accent-soft)', color: 'var(--accent)' }
        }
      >
        {action === 'verified' && 'AI verified'}
        {action === 'guess' && 'Needs you'}
        {action === 'unknown' && 'Unidentified'}
      </span>

      {action === 'verified' ? (
        <button
          onClick={() => toggleDevice(d.id)}
          className="switch"
          style={{ background: d.status === 'on' ? 'var(--accent)' : '', borderColor: d.status === 'on' ? 'var(--accent)' : '' }}
          title="Toggle"
        />
      ) : (
        <button
          onClick={() => (action === 'guess' ? startEdit(d) : searchOnline(d))}
          className="btn btn-ghost !px-3 !py-1.5 !text-[11px] shrink-0"
        >
          {action === 'guess' && <><Pencil className="w-3 h-3" /> Correct</>}
          {action === 'unknown' &&
            (searchingId === d.id ? (
              <><Search className="w-3 h-3 animate-pulse" /> scanning…</>
            ) : (
              <><Search className="w-3 h-3" /> AI identify</>
            ))}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Devices & AI</h1>
          <p className="text-[13px] text-muted mt-1">
            AI studies usage patterns, verifies specs online — you have the final say.
          </p>
        </div>
        <button className="btn btn-ghost !px-3 !py-2 shrink-0" title="Re-scan">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {unknown.length > 0 && (
        <div className="card p-4 mb-5">
          <p className="label mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            Needs AI identification · {unknown.length}
          </p>
          {unknown.map(d => (
            <Row key={d.id} d={d} action="unknown" />
          ))}
          {unknown[0] && !searchingId && (
            <p className="text-[11px] text-faint pl-12 -mt-1">
              Usage pattern: {unknown[0].pattern}
            </p>
          )}
        </div>
      )}

      {guesses.length > 0 && (
        <div className="card p-4 mb-5">
          <p className="label mb-1">Needs your confirmation · {guesses.length}</p>
          {guesses.map(d => (
            <div key={d.id} className="divide-y" style={{ borderColor: 'var(--border)' }}>
              <Row d={d} action="guess" />
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2 ml-12">
            <button
              onClick={() => setDevices(prev => prev.map(x => (x.id === guesses[0].id ? { ...x, verified: true } : x)))}
              className="btn btn-primary !px-3 !py-1.5 !text-[11px]"
            >
              <CheckCircle2 className="w-3 h-3" /> Confirm guess
            </button>
            <button onClick={() => startEdit(guesses[0])} className="btn btn-ghost !px-3 !py-1.5 !text-[11px]">
              <Pencil className="w-3 h-3" /> Correct details
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="label">Identified & verified · {verified.length}</p>
          <span className="text-[11px] text-faint flex items-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
        {verified.map(d => (
          <Row key={d.id} d={d} action="verified" />
        ))}
      </div>
    </div>
  );

  function Icon({ d }) {
    const I = iconFor(d.name);
    return <I className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
  }
}