export const mockHome = {
  name: "Guruprasad Residence",
  tariff: 8.0,
  hubConnected: true,
  hubType: "Home Assistant",
  lastMonthTotal: 4120,
  yesterdayTotal: 138,
  rooms: [
    { id: "r1", name: "Living Room", devices: ["d1", "d2"] },
    { id: "r2", name: "Master Bedroom", devices: ["d3"] },
    { id: "r3", name: "Kitchen", devices: ["d4", "d5", "d6"] },
    { id: "r4", name: "Guest Room", devices: [] },
  ],
  devices: [
    {
      id: "d1",
      name: "1.5T AC — Living Room",
      room: "Living Room",
      baseWatts: 1500,
      monthCost: 1850,
      todayCost: 62,
      status: "on",
      identified: true,
      verified: true,
    },
    {
      id: "d2",
      name: "LED TV + Soundbar",
      room: "Living Room",
      baseWatts: 130,
      monthCost: 210,
      todayCost: 7,
      status: "on",
      identified: true,
      verified: true,
    },
    {
      id: "d3",
      name: "Cooler",
      room: "Master Bedroom",
      baseWatts: 220,
      monthCost: 95,
      todayCost: 3,
      status: "on",
      identified: true,
      verified: false,
    },
    {
      id: "d4",
      name: "Refrigerator",
      room: "Kitchen",
      baseWatts: 320,
      monthCost: 640,
      todayCost: 21,
      status: "on",
      identified: true,
      verified: true,
    },
    {
      id: "d5",
      name: "Washing Machine",
      room: "Kitchen",
      baseWatts: 500,
      monthCost: 320,
      todayCost: 0,
      status: "paused",
      identified: true,
      verified: true,
    },
    {
      id: "d6",
      name: "Kitchen Plug 3",
      room: "Kitchen",
      baseWatts: 280,
      monthCost: 0,
      todayCost: 0,
      status: "on",
      identified: false,
      verified: false,
      pattern: "short bursts, mornings + evenings — could be a toaster, mixer or water heater",
    },
  ],
};

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function dailyProfile(device, seed) {
  const hours = [];
  for (let h = 0; h < 24; h++) {
    let f = 0.15 + 0.25 * Math.sin((h - 9) * 0.55) + 0.1 * Math.sin((h - 19) * 1.1);
    const on = h >= 6 && h <= 23;
    hours.push({
      hour: h,
      watts: on ? Math.round(Math.max(0, device.baseWatts * Math.max(0.12, f)) + seed) : 0,
    });
  }
  return hours;
}

export function weekTotals(totalMonth) {
  const factors = [0.82, 0.9, 1.04, 0.95, 1.12, 1.26, 0.88];
  return factors.map(f => Math.round((totalMonth / 30) * f));
}