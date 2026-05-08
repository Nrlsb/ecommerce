'use client';

import { useState, useEffect, FC } from 'react';
import { Calculator, Info, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCalculatorProps {
    defaultYield?: number;
    onApplyQuantity?: (quantity: number) => void;
}

const ProductCalculator: FC<ProductCalculatorProps> = ({ defaultYield = 10, onApplyQuantity }) => {
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [doors, setDoors] = useState<number>(0);
    const [windows, setWindows] = useState<number>(0);
    const [layers, setLayers] = useState<number>(2);
    const [litersNeeded, setLitersNeeded] = useState<number>(0);

    const calculate = () => {
        if (width && height) {
            const wallArea = parseFloat(width) * parseFloat(height);
            const openingsArea = (doors * 2.1) + (windows * 1.5); // Áreas estándar revisadas
            const netArea = Math.max(0, wallArea - openingsArea);
            const totalNeeded = (netArea / defaultYield) * layers;
            setLitersNeeded(parseFloat(totalNeeded.toFixed(1)));
        } else {
            setLitersNeeded(0);
        }
    };

    useEffect(() => {
        calculate();
    }, [width, height, layers, doors, windows, defaultYield]);

    const reset = () => {
        setWidth('');
        setHeight('');
        setDoors(0);
        setWindows(0);
        setLayers(2);
    };

    // Estimar latas necesarias (basado en tamaños estándar de Argentina)
    const getRecommendedContainers = () => {
        if (litersNeeded <= 0) return null;
        if (litersNeeded > 12) return { text: '1 Lata de 20L', qty: 1 };
        if (litersNeeded > 6) return { text: '1 Lata de 10L', qty: 1 };
        if (litersNeeded > 2.5) return { text: '1 Balde de 4L', qty: 1 };
        return { text: '1 Lata de 1L', qty: 1 };
    };

    const recommendation = getRecommendedContainers();

    return (
        <div className="glass rounded-[3.5rem] p-10 border border-white/40 dark:border-white/5 shadow-premium mt-20 overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />

            <div className="flex items-center gap-4 mb-10 text-primary relative">
                <div className="p-4 bg-primary/10 rounded-2xl">
                    <Calculator className="w-7 h-7" />
                </div>
                <div>
                    <h3 className="font-display font-black text-3xl uppercase tracking-tighter">Calculadora Pro</h3>
                    <p className="text-[10px] font-display font-bold text-foreground/40 uppercase tracking-[0.2em] -mt-1">Dpto. Técnico Mercurio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <label className="block text-[10px] font-display font-bold text-foreground/40 uppercase tracking-[0.2em] pl-1">Ancho (metros)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="4.5"
                                className="w-full px-6 py-5 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-display font-bold text-xl"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="block text-[10px] font-display font-bold text-foreground/40 uppercase tracking-[0.2em] pl-1">Alto (metros)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="2.8"
                                className="w-full px-6 py-5 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl focus:border-primary/50 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-display font-bold text-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/40 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 p-6 rounded-3xl flex flex-col gap-4">
                            <label className="text-[10px] font-display font-bold text-foreground/40 uppercase tracking-[0.2em]">Aberturas</label>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/60 uppercase">Puertas</span>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => setDoors(Math.max(0, doors - 1))} className="w-9 h-9 rounded-xl border border-slate-200/50 flex items-center justify-center hover:bg-white transition-all text-lg font-bold shadow-sm">-</button>
                                        <span className="font-display font-black text-xl w-4 text-center">{doors}</span>
                                        <button type="button" onClick={() => setDoors(doors + 1)} className="w-9 h-9 rounded-xl border border-slate-200/50 flex items-center justify-center hover:bg-white transition-all text-lg font-bold shadow-sm">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/60 uppercase">Ventanas</span>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => setWindows(Math.max(0, windows - 1))} className="w-9 h-9 rounded-xl border border-slate-200/50 flex items-center justify-center hover:bg-white transition-all text-lg font-bold shadow-sm">-</button>
                                        <span className="font-display font-black text-xl w-4 text-center">{windows}</span>
                                        <button type="button" onClick={() => setWindows(windows + 1)} className="w-9 h-9 rounded-xl border border-slate-200/50 flex items-center justify-center hover:bg-white transition-all text-lg font-bold shadow-sm">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 p-6 rounded-3xl flex flex-col gap-3">
                            <label className="text-[10px] font-display font-bold text-foreground/40 uppercase tracking-[0.2em]">Nº de Manos</label>
                            <div className="grid grid-cols-3 gap-3 h-full">
                                {[1, 2, 3].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setLayers(num)}
                                        className={`rounded-2xl font-display font-black transition-all flex items-center justify-center text-xl ${layers === num
                                                ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105'
                                                : 'bg-white/50 border border-slate-200/50 text-foreground/30 hover:bg-white'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-10 bg-primary/[0.03] rounded-[2.5rem] border-2 border-primary/5 text-center relative overflow-hidden group/result">
                    <div className="absolute top-6 right-6">
                        <button type="button" onClick={reset} className="p-2.5 hover:bg-primary/10 rounded-full text-foreground/20 transition-all hover:text-primary hover:rotate-180 duration-500">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-4">
                        <span className="text-[10px] font-display font-bold text-primary/40 uppercase tracking-[0.3em] mb-4 block">Volumen Estimado</span>
                        <div className="text-8xl font-display font-black text-primary flex items-baseline justify-center gap-2 mb-2 tracking-tighter">
                            {litersNeeded.toString().split('.')[0]}
                            <span className="text-4xl opacity-40">.{litersNeeded.toString().split('.')[1] || '0'}</span>
                            <span className="text-5xl font-light opacity-60">L</span>
                        </div>
                    </div>

                    {litersNeeded > 0 && recommendation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="space-y-5"
                        >
                            <div className="bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] font-display font-bold px-5 py-2.5 rounded-full inline-block uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                Sugerimos: {recommendation.text}
                            </div>

                            {onApplyQuantity && (
                                <button
                                    type="button"
                                    onClick={() => onApplyQuantity(recommendation.qty)}
                                    className="w-full py-5 bg-foreground text-background rounded-[1.5rem] font-display font-extrabold text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all transform active:scale-[0.98] shadow-2xl"
                                >
                                    Aplicar cantidad
                                </button>
                            )}
                        </motion.div>
                    )}

                    <div className="flex items-start gap-3 text-left bg-white/40 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 mt-8 mt-auto">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground/40 leading-relaxed font-medium">
                            El cálculo descuenta aberturas estándar (Puerta: 2.1m², Ventana: 1.5m²). Rendimiento base: <span className="text-primary font-bold">{defaultYield} m²/L</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCalculator;
