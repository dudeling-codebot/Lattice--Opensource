import { useOutletContext } from 'react-router-dom';
import { BarChart3, Shield, IndianRupee, Users, Info } from 'lucide-react';
import { useState } from 'react';

export default function Insights() {
  const { pro, activeColor } = useOutletContext();
  const [consent, setConsent] = useState(false);
  const [tariff, setTariff] = useState('8.00');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Insights & privacy</h1>
        <p className="text-sm text-slate-400 mt-1">Your data stays yours. Every choice below is explained in plain words.</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 mb-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${activeColor} bg-white/5 flex items-center justify-center shrink-0`}>
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">Electricity tariff</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Your tariff from the bill — LATTICE uses it to turn watts into rupees. Change it and every cost updates automatically.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass-button rounded-2xl px-4 py-3 max-w-[220px]">
          <span className="text-sm font-mono">₹</span>
          <input
            value={tariff}
            onChange={e => setTariff(e.target.value)}
            className="bg-transparent outline-none text-sm font-mono flex-1"
          />
          <span className="text-[11px] text-slate-500">/ unit</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 mb-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">Share anonymous usage insights</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Optional. With your consent, we combine patterns like "average AC consumption" or "peak-use hours" —
              <span className="text-slate-300"> no name, no address, no device identity</span> — and sell them to interested companies.
              LATTICE may use this for future Pro planning too. You can withdraw anytime; your data is excluded from that point on.
            </p>
          </div>
        </div>

        <button
          onClick={() => setConsent(c => !c)}
          className={`flex items-center justify-between w-full glass-button rounded-2xl px-4 py-3.5 transition-all ${
            consent ? (pro ? 'border-sky-400/40' : 'border-rose-400/40') : ''
          }`}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Users className={`w-4 h-4 ${consent ? activeColor : 'text-slate-500'}`} />
            {consent ? 'Sharing is ON' : 'Sharing is OFF'}
          </span>
          <span
            className={`relative w-11 h-6 rounded-full transition-all ${
              consent ? (pro ? 'bg-sky-500' : 'bg-rose-500') : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${consent ? 'left-[22px]' : 'left-0.5'}`}
            />
          </span>
        </button>
        <p className="text-[11px] text-slate-600 mt-3 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          In the final build this is stored in your account and reversible at any time from this screen.
        </p>
      </div>

      {!pro && (
        <div className="glass-panel-pro rounded-3xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sky-200">Upgrade to PRO</h2>
            <p className="text-[12px] text-sky-100/60 mt-0.5">Electric Blue mode, tariff discounts and deeper insights — FREE during demo.</p>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-600 mt-4 leading-relaxed">
        Free projects on Supabase sleep after 7 days unused — the morning of any demo, log into supabase.com and unpause
        your project so your saved data features work.
      </p>
    </div>
  );
}