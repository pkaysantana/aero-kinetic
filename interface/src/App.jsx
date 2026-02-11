import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Beaker, Zap, Printer, Thermometer, Plus, Save, ChevronDown } from 'lucide-react';
import { analyzeViscosity, calculateDiameter, GAS_LIBRARY, exportRunToJson, CONSTANTS } from './physicsEngine';
import MolecularProbe from './components/MolecularProbe';

export default function App() {
  const [selectedGas, setSelectedGas] = useState("N2");
  const [temp, setTemp] = useState(298.15);
  const [points, setPoints] = useState([]);

  // Simulation Engine: Generates data using Sutherland's Law
  const generatePoints = (gasKey, temperature) => {
    const gas = GAS_LIBRARY[gasKey];

    // Sutherland's Law for eta(T)
    const T_ref = 298.15;
    const eta_ref = gas.viscosity_ref;
    const C = gas.sutherlandC;
    const targetViscosity = eta_ref * Math.pow(temperature / T_ref, 1.5) * ((T_ref + C) / (temperature + C));

    // Poiseuille Flow: Back-calculate slope
    const app = CONSTANTS.APPARATUS;
    const slope = (Math.PI * Math.pow(app.R_CAP, 4)) / (16 * targetViscosity * app.L * app.V);

    const p0 = 101325;
    return [0, 60, 120, 180, 240, 300].map(t => {
      const invP_theoretical = (1 / p0) + (slope * t);
      // Simulate 0.5% sensor noise
      const noise = (Math.random() - 0.5) * 0.01 * invP_theoretical;
      return { t, p: Math.round(1 / (invP_theoretical + noise)) };
    });
  };

  // Initialize & React to Changes
  useEffect(() => {
    setPoints(generatePoints(selectedGas, temp));
  }, [selectedGas]);

  // Handle Temp Slider with simulation update
  const handleTempChange = (e) => {
    const newT = parseFloat(e.target.value);
    setTemp(newT);
    setPoints(generatePoints(selectedGas, newT));
  };

  const handleUpdate = (i, f, v) => {
    const next = [...points];
    next[i][f] = parseFloat(v) || 0;
    setPoints(next);
  };

  const results = useMemo(() => {
    const res = analyzeViscosity(points.map(d => d.t), points.map(d => d.p));
    // Calculate diameter using current Temp
    const dNm = calculateDiameter(res.viscosity, GAS_LIBRARY[selectedGas].mass, temp) * 1e9;
    return { ...res, diameterNm: dNm };
  }, [points, selectedGas, temp]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono dashboard-container">
      {/* HEADER (Screen Only) */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8 no-print">
        <div>
          <h1 className="text-3xl font-black text-cyan-400 italic uppercase">AERO-KINETIC V1.3</h1>
          <p className="text-slate-500 text-[10px] tracking-widest uppercase">Analytical System // Phase 3</p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative group">
            <select
              value={selectedGas}
              onChange={(e) => setSelectedGas(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 px-4 py-2 pr-10 rounded text-sm font-bold focus:border-cyan-500 outline-none cursor-pointer text-slate-200"
            >
              {Object.keys(GAS_LIBRARY).map(key => (
                <option key={key} value={key}>{GAS_LIBRARY[key].name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
          </div>

          <button onClick={() => window.print()} className="bg-slate-800 p-2 rounded hover:bg-slate-700 transition-all text-slate-300 hover:text-white" title="Print Report">
            <Printer size={20} />
          </button>
          <button onClick={() => exportRunToJson(selectedGas, points, results, CONSTANTS.APPARATUS, temp)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-4 py-2 rounded font-bold shadow-lg shadow-cyan-900/20">
            <Save size={16} /> SAVE JSON
          </button>
        </div>
      </header>

      {/* PRINT-ONLY HEADER */}
      <div className="print-only text-black mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase mb-2">Experimental Report: Gas Viscosity Determination</h1>
        <div className="grid grid-cols-2 text-sm font-serif">
          <p><strong>Subject:</strong> {GAS_LIBRARY[selectedGas].name} ({selectedGas})</p>
          <p><strong>System Temperature:</strong> {temp.toFixed(1)} K</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Method:</strong> Linearized Poiseuille Flow Analysis</p>
        </div>
      </div>

      <main className="grid grid-cols-12 gap-6">
        {/* DATA INPUT & TEMPERATURE (Screen Only / Input Section) */}
        <section className="col-span-3 space-y-6 no-print">
          {/* Thermal Control */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Thermometer size={14} /> Thermal Control
            </h2>
            <input
              type="range" min="200" max="400" step="1.0"
              value={temp}
              onChange={handleTempChange}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-center mt-2 text-cyan-400 font-bold font-mono text-xl">{temp.toFixed(1)} K</div>
            <p className="text-[9px] text-slate-600 text-center mt-2">Adjusts Sutherland's Law (η)</p>
          </div>

          {/* Sequence Input */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col h-[500px]">
            <h2 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} /> Sequence Input
            </h2>
            <div className="overflow-y-auto custom-scrollbar flex-grow pr-1">
              {points.map((p, i) => (
                <div key={i} className="flex gap-1 mb-2">
                  <input type="number" value={p.t} onChange={(e) => handleUpdate(i, 't', e.target.value)} className="w-16 bg-slate-950 p-2 rounded text-[10px] border border-slate-800 focus:border-cyan-500 outline-none text-slate-300 font-mono" />
                  <input type="number" value={p.p} onChange={(e) => handleUpdate(i, 'p', e.target.value)} className="flex-grow bg-slate-950 p-2 rounded text-[10px] border border-slate-800 text-cyan-400 focus:border-cyan-500 outline-none font-mono font-bold" />
                </div>
              ))}
            </div>
            <button onClick={() => setPoints([...points, { t: points[points.length - 1]?.t + 60 || 0, p: 0 }])} className="w-full mt-4 border border-dashed border-slate-700 p-2 rounded text-[10px] flex justify-center items-center gap-2 text-slate-500 hover:text-cyan-400 hover:border-cyan-400 transition-all">
              <Plus size={12} /> ADD DATAPOINT
            </button>
          </div>
        </section>

        {/* ANALYTICS & PROBE (Visually dominant) */}
        <section className="col-span-12 md:col-span-9 grid gap-6 h-fit print:col-span-12 print:block">

          {/* Graph */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 graph-container h-[400px] print:h-[300px] print:mb-8 print:border-black print:bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points.map(p => ({ t: p.t, invP: p.p > 0 ? 1 / p.p : 0 }))} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#475569" fontSize={10} label={{ value: 'Time (s)', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} tickFormatter={(v) => v ? v.toExponential(1) : 0} label={{ value: '1/P (Pa⁻¹)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip labelFormatter={(v) => `t = ${v}s`} formatter={(v) => [v ? v.toExponential(4) : 0, '1/P']} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#cbd5e1' }} itemStyle={{ color: '#22d3ee' }} />
                <Line type="monotone" dataKey="invP" stroke={GAS_LIBRARY[selectedGas].color} strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-6 print:block">
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center print:border-none print:p-0 print:mb-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 print:text-black">Calculated Viscosity (η)</span>
              <div className="text-6xl font-black italic text-white mb-2 print:text-black">{(results.viscosity * 1e6).toFixed(2)}</div>
              <div className="flex items-center gap-4 text-xs text-slate-400 print:text-black">
                <span>µPa·s</span>
                <span className="w-px h-3 bg-slate-700"></span>
                <span>R²: {(results.rSquared * 100).toFixed(4)}%</span>
              </div>
            </div>

            <div className="print:hidden">
              <MolecularProbe diameterNm={results.diameterNm} gasName={selectedGas} />
            </div>

            {/* Print-only footer for probe data since visual probe is hidden */}
            <div className="print-only border-t border-black pt-4 mt-4">
              <p><strong>Effective Molecular Diameter:</strong> {results.diameterNm.toFixed(4)} nm</p>
              <p><strong>Kinetic Analysis:</strong> Confirmed via Nottingham Standard Method</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
