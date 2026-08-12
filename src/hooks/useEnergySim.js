import { useEffect, useRef, useState } from 'react';

export function useEnergySim(initialDevices) {
  const [devices, setDevices] = useState(() =>
    initialDevices.map(d => ({ ...d, currentWatts: d.status === 'on' ? Math.round(d.baseWatts * 0.55) : 0 }))
  );
  const [paused, setPaused] = useState(false);
  const targetsRef = useRef({});

  useEffect(() => {
    targetsRef.current = {};
    initialDevices.forEach(d => {
      targetsRef.current[d.id] = d.status === 'on' ? d.baseWatts * (0.45 + Math.random() * 0.5) : 0;
    });
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setDevices(prev =>
        prev.map(d => {
          if (Math.random() < 0.1) {
            targetsRef.current[d.id] =
              d.status === 'on' ? d.baseWatts * (0.35 + Math.random() * 0.65) : 0;
          }
          const target = targetsRef.current[d.id] ?? 0;
          const next = d.currentWatts + (target - d.currentWatts) * 0.16;
          return { ...d, currentWatts: Math.max(0, Math.round(next)) };
        })
      );
    }, 300);
    return () => clearInterval(iv);
  }, [paused]);

  const totalWatts = devices.reduce((s, d) => s + d.currentWatts, 0);
  const totalToday = devices.reduce((s, d) => s + d.todayCost, 0);
  const totalMonth = devices.reduce((s, d) => s + d.monthCost, 0);

  return { devices, paused, setPaused, totalWatts, totalToday, totalMonth };
}