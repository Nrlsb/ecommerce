'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, RotateCcw } from 'lucide-react';

export default function ProductCalculator({ defaultYield = 10 }) {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [doors, setDoors] = useState(0);
    const [windows, setWindows] = useState(0);
    const [layers, setLayers] = useState(2);
    const [litersNeeded, setLitersNeeded] = useState(0);

    const calculate = () => {
        if (width && height) {
            const wallArea = parseFloat(width) * parseFloat(height);
            const openingsArea = (doors * 2) + (windows * 1.5);
            const netArea = Math.max(0, wallArea - openingsArea);
            const totalNeeded = (netArea / defaultYield) * layers;
            setLitersNeeded(totalNeeded.toFixed(1));
        } else {
            setLitersNeeded(0);
        }
    };

    useEffect(() => {
        calculate();
    }, [width, height, layers, doors, windows]);

    const reset = () => {
        setWidth('');
        setHeight('');
        setDoors(0);
        setWindows(0);
        setLayers(2);
    };

    return (
        <div className="bg-muted/50 rounded-2xl p-6 border border-border mt-8">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <Calculator className="w-6 h-6" />
                <h3 className="font-bold text-xl uppercase tracking-tight">Calculadora de Material</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-1.5">Ancho (m)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="Ej: 4.5"
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-1.5">Alto (m)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="Ej: 2.8"
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-1.5">Puertas</label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setDoors(Math.max(0, doors - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">-</button>
                                <span className="font-bold">{doors}</span>
                                <button onClick={() => setDoors(doors + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-1.5">Ventanas</label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setWindows(Math.max(0, windows - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">-</button>
                                <span className="font-bold">{windows}</span>
                                <button onClick={() => setWindows(windows + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">+</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-1.5">Cantidad de manos</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setLayers(num)}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${layers === num
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-background border border-border text-foreground/60 hover:bg-muted'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <button onClick={reset} className="p-1 hover:bg-primary/10 rounded-full text-foreground/40 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    <span className="text-sm font-medium text-primary/60 uppercase tracking-widest mb-2">Litros estimados</span>
                    <div className="text-5xl font-black text-primary mb-2">
                        {litersNeeded} <span className="text-2xl">L</span>
                    </div>

                    {litersNeeded > 0 && (
                        <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 animate-pulse">
                            RECOMENDAMOS: {litersNeeded > 10 ? 'Lata de 20L' : litersNeeded > 4 ? 'Lata de 10L' : 'Lata de 4L'}
                        </div>
                    )}

                    <div className="flex items-start gap-2 text-left bg-white/50 p-3 rounded-lg border border-border">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground/60 leading-tight">
                            El cálculo descuenta aberturas estándar (Puerta: 2m², Ventana: 1.5m²). Rendimiento base: {defaultYield} m²/L.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
