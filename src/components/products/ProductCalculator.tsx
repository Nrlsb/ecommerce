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
        <div className="bg-gradient-to-br from-muted/80 to-muted/30 rounded-[2.5rem] p-8 border border-border/50 shadow-xl backdrop-blur-sm mt-12 overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="flex items-center gap-3 mb-8 text-primary relative">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <Calculator className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-black text-2xl uppercase tracking-tighter">Calculadora Pro</h3>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest -mt-1">Dpto. Técnico Mercurio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest pl-1">Ancho (metros)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="4.5"
                                className="w-full px-5 py-4 bg-background border-2 border-border/50 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest pl-1">Alto (metros)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="2.8"
                                className="w-full px-5 py-4 bg-background border-2 border-border/50 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="bg-background/50 border border-border/50 p-4 rounded-2xl flex flex-col gap-3">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Aberturas</label>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground/60">Puertas</span>
                                    <div className="flex items-center gap-3 pt-1">
                                        <button onClick={() => setDoors(Math.max(0, doors - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors text-lg font-bold">-</button>
                                        <span className="font-black text-lg w-4 text-center">{doors}</span>
                                        <button onClick={() => setDoors(doors + 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors text-lg font-bold">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground/60">Ventanas</span>
                                    <div className="flex items-center gap-3 pt-1">
                                        <button onClick={() => setWindows(Math.max(0, windows - 1))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors text-lg font-bold">-</button>
                                        <span className="font-black text-lg w-4 text-center">{windows}</span>
                                        <button onClick={() => setWindows(windows + 1)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors text-lg font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background/50 border border-border/50 p-4 rounded-2xl flex flex-col gap-2">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Nº de Manos</label>
                            <div className="grid grid-cols-3 gap-2 h-full">
                                {[1, 2, 3].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setLayers(num)}
                                        className={`rounded-xl font-black transition-all flex items-center justify-center text-lg ${layers === num
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                                : 'bg-background border border-border/50 text-foreground/40 hover:bg-muted/80'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-8 bg-primary/[0.03] rounded-[2rem] border-2 border-primary/10 text-center relative overflow-hidden group/result">
                    <div className="absolute top-4 right-4">
                        <button onClick={reset} className="p-2 hover:bg-primary/10 rounded-full text-foreground/30 transition-colors hover:text-primary">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    <div>
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-4 block">Volumen Estimado</span>
                        <div className="text-7xl font-black text-primary flex items-baseline justify-center gap-2 mb-2">
                            {litersNeeded.toString().split('.')[0]}
                            <span className="text-3xl opacity-50">.{litersNeeded.toString().split('.')[1] || '0'}</span>
                            <span className="text-4xl font-light">L</span>
                        </div>
                    </div>

                    {litersNeeded > 0 && recommendation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-primary text-white text-[11px] font-black px-4 py-2 rounded-full inline-block uppercase tracking-wider shadow-lg shadow-primary/20">
                                Sugerimos: {recommendation.text}
                            </div>

                            {onApplyQuantity && (
                                <button
                                    onClick={() => onApplyQuantity(recommendation.qty)}
                                    className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-xl"
                                >
                                    Aplicar cantidad al carrito
                                </button>
                            )}
                        </motion.div>
                    )}

                    <div className="flex items-start gap-3 text-left bg-background/50 p-4 rounded-xl border border-border/50 mt-6 mt-auto">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground/50 leading-relaxed font-medium">
                            El cálculo descuenta aberturas estándar (Puerta: 2.1m², Ventana: 1.5m²). Rendimiento base aplicado: <span className="text-primary font-bold">{defaultYield} m²/L</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCalculator;
