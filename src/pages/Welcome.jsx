import { useNavigate } from 'react-router-dom';
import { Plug, Cpu, IndianRupee, ArrowRight } from 'lucide-react';

export default function Welcome({ onStart }) {
  const navigate = useNavigate();

  const start = () => {
    onStart();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 bg-lattice-grid pointer-events-none" />
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.14) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="glass-panel rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto rounded-2xl glow-magenta bg-rose-500 flex items-center justify-center mb-5">
            <img src="/lattice-mark.svg" alt="LATTICE" className="w-9 h-9" draggable="false" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">LATTICE</h1>
          <p className="text-[11px] text-slate-400 uppercase tracking-[0.25em] mt-1 mb-6">
            Connecting Ideas. Building Solutions.
          </p>
          <p className="text-sm text-slate-300 mb-7 leading-relaxed">
            Your home's electricity, understood.<br />
            Every room, every appliance, every rupee.
          </p>

          <div className="flex flex-col gap-2 mb-7">
            {[
              { icon: Plug, label: 'Connects to your Home Assistant' },
              { icon: Cpu, label: 'AI identifies unknown appliances' },
              { icon: IndianRupee, label: 'Live ₹ cost per device' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-center gap-2 text-[13px] text-slate-300">
                <f.icon className="w-4 h-4 text-rose-400" />
                {f.label}
              </div>
            ))}
          </div>

          <button
            onClick={start}
            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all glow-magenta"
          >
            Continue as demo user <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 mt-4">
            Demo mode — no account needed. Full logins come with the final build.
          </p>
        </div>
      </div>
    </div>
  );
}