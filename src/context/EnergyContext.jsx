import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockHome } from '../data/mockData.js';

const EnergyContext = createContext(null);

export function EnergyProvider({ children }) {
  const [devices, setDevices] = useState(() =>
    mockHome.devices.map(d => ({
      ...d,
      currentWatts: d.status === 'on' ? Math.round(d.baseWatts * 0.55) : 0,
    }))
  );
  const [paused, setPaused] = useState(false);
  const targetsRef = useRef({});

  useEffect(() => {
    targetsRef.current = {};
    devices.forEach(d => {
      targetsRef.current[d.id] = d.status === 'on' ? d.baseWatts * (0.45 + Math.random() * 0.5) : 0;
    });
  }, [paused, devices.length]);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setDevices(prev =>
        prev.map(d => {
          if (d.status === 'on' && Math.random() < 0.1) {
            targetsRef.current[d.id] = d.baseWatts * (0.35 + Math.random() * 0.65);
          }
          const target = targetsRef.current[d.id] ?? 0;
          const next = d.currentWatts + (target - d.currentWatts) * 0.16;
          return { ...d, currentWatts: Math.max(0, Math.round(next)) };
        })
      );
    }, 300);
    return () => clearInterval(iv);
  }, [paused]);

  const toggleDevice = id => {
    setDevices(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        const on = d.status !== 'on';
        const next = { ...d, status: on ? 'on' : 'off' };
        targetsRef.current[id] = on ? next.baseWatts * (0.45 + Math.random() * 0.5) : 0;
        return next;
      })
    );
  };

  const totalWatts = devices.reduce((s, d) => s + d.currentWatts, 0);
  const totalToday = devices.reduce((s, d) => s + d.todayCost, 0);
  const totalMonth = devices.reduce((s, d) => s + d.monthCost, 0);

  return (
    <EnergyContext.Provider value={{ devices, paused, setPaused, toggleDevice, totalWatts, totalToday, totalMonth }}>
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  return useContext(EnergyContext);
}