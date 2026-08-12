import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plug, CheckCircle2, Loader2, KeyRound, Globe, ArrowRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const STEPS = ['Check network', 'Connect to Home Assistant', 'Authorize'];

export default function Connect() {
  const { pro, activeColor } = useOutletContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [haUrl, setHaUrl] = useState('http://homeassistant.local:8123');
  const [code, setCode] = useState('');

  const connect = () => {
    setBusy(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setBusy(false);
      if (step + 1 >= STEPS.length) setDone(true);
    }, 1400);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Connect your home</h1>
        <p className="text-sm text-slate-400 mt-1">
          LATTICE imports rooms, devices and energy sensors from your Home Assistant.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all ${
                i < step || done
                  ? pro ? 'bg-sky-400' : 'bg-rose-500'
                  : i === step ? 'bg-white/30' : 'bg-white/10'
              }`}
            />
            <p className={`text-[10px] mt-1.5 ${i <= step || done ? activeColor : 'text-slate-600'}`}>
              {s}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6">
        {done ? (
          <div className="text-center py-6">
            <div className={`w-16 h-16 mx-auto rounded-2xl ${activeColor} bg-white/5 flex items-center justify-center mb-4`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold">Home Assistant connected!</h2>
            <p className="text-sm text-slate-400 mt-1 mb-6">
              Imported 4 rooms and 6 devices. 1 device needs identification.
            </p>
            <button
              onClick={() => navigate('/devices')}
              className={`bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl px-6 py-3 flex items-center gap-2 mx-auto transition-all ${
                pro ? 'bg-sky-500 hover:bg-sky-400' : ''
              }`}
            >
              Review imported devices <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : busy ? (
          <div className="text-center py-10">
            <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-4 ${activeColor}`} />
            <p className="text-sm text-slate-300">
              {step === 0 && 'Checking your local network…'}
              {step === 1 && 'Connecting to Home Assistant…'}
              {step === 2 && 'Verifying authorization…'}
            </p>
          </div>
        ) : (
          <div>
            {step === 0 && (
              <div>
                <p className="text-sm text-slate-300 mb-4">
                  LATTICE looks for your Home Assistant on the same Wi-Fi network.
                </p>
                <div className="flex items-center gap-3 glass-button rounded-2xl px-4 py-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-[13px] font-semibold">Network detected</p>
                    <p className="text-[11px] text-slate-400">Your home network is reachable</p>
                  </div>
                </div>
                <button
                  onClick={connect}
                  className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl py-3 flex items-center justify-center gap-2 transition-all"
                >
                  <Plug className="w-4 h-4" /> Scan for Home Assistant
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <label className="text-[12px] text-slate-400 mb-2 block">Home Assistant address</label>
                <div className="flex items-center gap-2 glass-button rounded-2xl px-4 py-3 mb-4">
                  <Globe className={`w-4 h-4 shrink-0 ${activeColor}`} />
                  <input
                    value={haUrl}
                    onChange={e => setHaUrl(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1 font-mono"
                  />
                </div>
                <p className="text-[12px] text-slate-500 mb-5">
                  Usually <span className="font-mono text-slate-300">http://homeassistant.local:8123</span> on
                  your home network.
                </p>
                <button
                  onClick={connect}
                  className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl py-3 flex items-center justify-center gap-2 transition-all"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <KeyRound className={`w-5 h-5 ${activeColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Authorize LATTICE</p>
                    <p className="text-[11px] text-slate-400">
                      Enter the 6-digit code shown in Home Assistant
                    </p>
                  </div>
                </div>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-center font-mono text-2xl tracking-[0.5em] bg-white/5 border border-white/10 rounded-2xl py-4 outline-none focus:border-rose-400/40 mb-5"
                />
                <button
                  onClick={connect}
                  disabled={code.length < 6}
                  className="w-full bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-3 flex items-center justify-center gap-2 transition-all"
                >
                  Confirm & import <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 text-[12px] text-slate-500 mt-4 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}