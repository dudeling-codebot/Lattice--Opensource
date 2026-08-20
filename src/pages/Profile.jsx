import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MapPin, BadgeCheck, Shield, LogOut, Edit3, Save, X, Home, Hash, Calendar, Zap, KeyRound, Smartphone } from 'lucide-react';
import { mockUser, mockHome } from '../data/mockData.js';

export default function Profile() {
  const { pro } = useOutletContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: mockUser.name,
    gmail: mockUser.gmail,
    phone: mockUser.phone,
    address: mockUser.address,
  });

  const handleSave = () => setEditing(false);
  const handleCancel = () => { setForm({ name: mockUser.name, gmail: mockUser.gmail, phone: mockUser.phone, address: mockUser.address }); setEditing(false); };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
        <p className="text-[13px] text-muted mt-1">Your account, home and login details — all in one place.</p>
      </div>

      {/* Hero */}
      <div className="card p-5 sm:p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold shrink-0" style={{ background: 'var(--accent)', color: '#fff' }}>
            {mockUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-extrabold truncate">{form.name}</h2>
              {pro ? <span className="chip" style={{ background: 'rgba(14,165,233,0.14)', color: '#0EA5E9' }}>PRO</span> : <span className="chip" style={{ background: 'var(--surface-2)' }}>{mockUser.plan}</span>}
              {mockUser.verifiedGmail && <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--green)' }}><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>}
            </div>
            <p className="text-[13px] font-mono flex items-center gap-1.5 mt-1" style={{ color: 'var(--text-muted)' }}><Mail className="w-3.5 h-3.5" /> {form.gmail}</p>
            <p className="text-[12px] text-faint mt-1 flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> {mockHome.name} · {mockUser.accountId}</p>
          </div>
          <button onClick={() => editing ? handleCancel() : setEditing(true)} className="btn btn-ghost !px-3 !py-2 shrink-0">
            {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Gmail & Account details */}
      <div className="card p-5 mb-4">
        <p className="label mb-4">Account details</p>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-faint flex items-center gap-1.5 mb-1.5"><Mail className="w-3.5 h-3.5" /> Gmail address</label>
            {editing ? (
              <input value={form.gmail} onChange={e => setForm(f => ({ ...f, gmail: e.target.value }))} className="input w-full font-mono text-[13px]" placeholder="your@gmail.com" />
            ) : (
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'var(--surface-2)' }}>
                <span className="font-mono text-[13px] font-semibold truncate">{form.gmail}</span>
                <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--green)' }}><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>
              </div>
            )}
            <p className="text-[11px] text-faint mt-1.5">Used for login, bills and alerts. OTP verified.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-faint flex items-center gap-1.5 mb-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
              {editing ? <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input w-full font-mono text-[13px]" /> : <div className="rounded-xl px-3 py-2.5 font-mono text-[13px] font-semibold" style={{ background: 'var(--surface-2)' }}>{form.phone}</div>}
            </div>
            <div>
              <label className="text-[11px] font-bold text-faint flex items-center gap-1.5 mb-1.5"><Hash className="w-3.5 h-3.5" /> Account ID</label>
              <div className="rounded-xl px-3 py-2.5 font-mono text-[13px] font-bold flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
                <span>{mockUser.accountId}</span>
                <span className="text-[10px] chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Active</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-faint flex items-center gap-1.5 mb-1.5"><MapPin className="w-3.5 h-3.5" /> Address / Home</label>
            {editing ? <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input w-full text-[13px]" /> : <div className="rounded-xl px-3 py-2.5 text-[13px] leading-snug" style={{ background: 'var(--surface-2)' }}>{form.address}</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Calendar className="w-3 h-3" /> Member since</p>
              <p className="text-[13px] font-bold mt-1">{mockUser.memberSince}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Zap className="w-3 h-3" /> Tariff</p>
              <p className="text-[13px] font-bold mt-1">₹{mockHome.tariff} / unit</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
              <p className="text-[11px] text-faint flex items-center gap-1"><Home className="w-3 h-3" /> Hub</p>
              <p className="text-[13px] font-bold mt-1 truncate">{mockHome.hubType}</p>
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} className="btn btn-primary w-full justify-center">
              <Save className="w-4 h-4" /> Save changes
            </button>
          )}
        </div>
      </div>

      {/* Other account details */}
      <div className="card p-5 mb-4">
        <p className="label mb-4">Other account details</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: 'var(--surface-2)' }}>
            <span className="flex items-center gap-2 text-[13px] font-semibold"><Shield className="w-4 h-4 text-muted" /> Two-factor (Gmail OTP)</span>
            <span className="chip" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>On</span>
          </div>
          <div className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: 'var(--surface-2)' }}>
            <span className="flex items-center gap-2 text-[13px] font-semibold"><Smartphone className="w-4 h-4 text-muted" /> Linked devices</span>
            <span className="text-[12px] font-mono text-muted">{mockHome.devices.length} devices · {mockHome.rooms.length} rooms</span>
          </div>
          <div className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: 'var(--surface-2)' }}>
            <span className="flex items-center gap-2 text-[13px] font-semibold"><KeyRound className="w-4 h-4 text-muted" /> Password</span>
            <button className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>Change →</button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <p className="text-[13px] font-semibold flex items-center gap-2"><LogOut className="w-4 h-4 text-muted" /> Session</p>
        <p className="text-[11px] text-faint mt-1">Signed in via Gmail on this device. Sign out will require OTP next login.</p>
        <button className="btn btn-ghost w-full mt-3 justify-center" style={{ borderColor: 'rgba(225,29,72,0.3)', color: 'var(--accent)' }}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
