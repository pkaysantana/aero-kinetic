// interface/src/components/MolecularProbe.jsx
import React from 'react';

export default function MolecularProbe({ diameterNm, gasName }) {
    // Molecule structural definitions
    const getStructure = (gas) => {
        // N2: Diatomic (Triple bond)
        if (gas === "N2") return (
            <div className="flex items-center justify-center relative scale-90">
                <div className="w-24 h-24 rounded-full bg-cyan-500 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] z-10 -mr-6 relative">
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/30 rounded-full filter blur-md"></div>
                </div>
                <div className="w-24 h-24 rounded-full bg-cyan-500 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] z-0 relative">
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/30 rounded-full filter blur-md"></div>
                </div>
                <div className="absolute font-bold text-white/20 text-4xl tracking-[2em] ml-8 pointer-events-none">N≡N</div>
            </div>
        );

        // CO2: Linear Triatomic (O=C=O)
        if (gas === "CO2") return (
            <div className="flex items-center justify-center relative scale-75">
                {/* Oxygen (Red) */}
                <div className="w-20 h-20 rounded-full bg-red-500 shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.6)] z-0 -mr-4 relative"></div>
                {/* Carbon (Black/Dark Grey) */}
                <div className="w-24 h-24 rounded-full bg-slate-800 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)] z-10 relative flex items-center justify-center border border-slate-700">
                    <span className="text-white/10 font-black text-2xl">C</span>
                </div>
                {/* Oxygen (Red) */}
                <div className="w-20 h-20 rounded-full bg-red-500 shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.6)] z-0 -ml-4 relative"></div>

                <div className="absolute w-full h-1 bg-slate-500/0 z-0"></div>
            </div>
        );

        // Noble Gases (Monatomic sphere)
        const isHe = gas === "He";
        return (
            <div className={`rounded-full ${isHe ? 'bg-amber-400 w-24 h-24' : 'bg-slate-400 w-32 h-32'} shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] relative flex items-center justify-center drop-shadow-2xl`}>
                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/40 rounded-full filter blur-sm"></div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-4 left-6 text-[10px] text-slate-500 font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Micro-Scale Reconstruction
            </div>

            {/* MOLECULE RENDERER */}
            <div className="flex-grow flex items-center justify-center transition-all duration-700 ease-out">
                {getStructure(gasName)}
            </div>

            <div className="text-center w-full mt-auto">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Effective Collision Diameter</div>
                <div className="text-4xl font-black text-white font-mono flex items-baseline justify-center gap-2">
                    {diameterNm.toFixed(3)} <span className="text-sm font-normal text-slate-500">nm</span>
                </div>
            </div>

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
        </div>
    );
}
