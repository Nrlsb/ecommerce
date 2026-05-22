'use client';

import { useState, useEffect, FC } from 'react';
import { Calculator, Info, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCalculatorProps {
    defaultYield?: number;
    onApplyQuantity?: (quantity: number) => void;
}

interface Wall {
    id: string;
    width: string;
    height: string;
}

const ProductCalculator: FC<ProductCalculatorProps> = ({ defaultYield = 10, onApplyQuantity }) => {
    const [walls, setWalls] = useState<Wall[]>([
        { id: '1', width: '', height: '' }
    ]);
    const [doors, setDoors] = useState<number>(0);
    const [windows, setWindows] = useState<number>(0);
    const [layers, setLayers] = useState<number>(2);
    const [litersNeeded, setLitersNeeded] = useState<number>(0);

    const calculate = () => {
        const wallArea = walls.reduce((sum, wall) => {
            const w = parseFloat(wall.width) || 0;
            const h = parseFloat(wall.height) || 0;
            return sum + (w * h);
        }, 0);

        if (wallArea > 0) {
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
    }, [walls, layers, doors, windows, defaultYield]);

    const reset = () => {
        setWalls([{ id: '1', width: '', height: '' }]);
        setDoors(0);
        setWindows(0);
        setLayers(2);
    };

    const addWall = () => {
        const lastHeight = walls[walls.length - 1]?.height || '';
        setWalls([...walls, { id: Math.random().toString(), width: '', height: lastHeight }]);
    };

    const removeWall = (id: string) => {
        if (walls.length > 1) {
            setWalls(walls.filter(wall => wall.id !== id));
        }
    };

    const updateWall = (id: string, field: 'width' | 'height', value: string) => {
        setWalls(walls.map(wall => {
            if (wall.id === id) {
                return { ...wall, [field]: value };
            }
            return wall;
        }));
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
        <div className="glass rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 shadow-premium mt-12 overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />

            <div className="flex items-center gap-3 mb-8 text-primary relative">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Calculator className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter">Calculadora Pro</h3>
                    <p className="text-[9px] font-display font-bold text-foreground/60 uppercase tracking-[0.2em] -mt-1">Dpto. Técnico Mercurio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
                <div className="space-y-6">
                    {/* Lista de Paredes / Medidas */}
                    <div className="space-y-3">
                        <span className="block text-[10px] font-display font-bold text-foreground/70 uppercase tracking-[0.2em] pl-1">Paredes / Medidas</span>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {walls.map((wall, index) => (
                                    <motion.div
                                        key={wall.id}
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-end gap-2 p-3 bg-white/30 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 relative group/wall overflow-hidden"
                                    >
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="block text-[8px] font-display font-bold text-foreground/50 uppercase tracking-[0.2em] pl-1">
                                                    Pared {index + 1} - Ancho (m)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={wall.width}
                                                    onChange={(e) => updateWall(wall.id, 'width', e.target.value)}
                                                    placeholder="4.5"
                                                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-300/50 dark:border-slate-800/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/5 outline-none transition-all font-display font-bold text-base"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-[8px] font-display font-bold text-foreground/50 uppercase tracking-[0.2em] pl-1">
                                                    Alto (m)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={wall.height}
                                                    onChange={(e) => updateWall(wall.id, 'height', e.target.value)}
                                                    placeholder="2.8"
                                                    className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-slate-300/50 dark:border-slate-800/50 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/5 outline-none transition-all font-display font-bold text-base"
                                                />
                                            </div>
                                        </div>
                                        {walls.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeWall(wall.id)}
                                                className="p-3 mb-[1px] bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                                                title="Eliminar pared"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <button
                            type="button"
                            onClick={addWall}
                            className="w-full py-3.5 border border-dashed border-primary/30 hover:border-primary/60 text-primary bg-primary/5 hover:bg-primary/10 rounded-2xl font-display font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Pared
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Aberturas */}
                        <div className="bg-white/40 dark:bg-slate-950/40 border border-slate-300/30 dark:border-slate-800/30 p-5 rounded-2xl flex flex-col gap-4">
                            <label className="text-[10px] font-display font-bold text-foreground/70 uppercase tracking-[0.2em]">Aberturas</label>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-wider block">Puertas</span>
                                    <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 rounded-xl p-1.5 border border-slate-200/50">
                                        <button type="button" onClick={() => setDoors(Math.max(0, doors - 1))} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all text-base font-bold shadow-sm">-</button>
                                        <span className="font-display font-black text-lg w-6 text-center">{doors}</span>
                                        <button type="button" onClick={() => setDoors(doors + 1)} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all text-base font-bold shadow-sm">+</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-wider block">Ventanas</span>
                                    <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 rounded-xl p-1.5 border border-slate-200/50">
                                        <button type="button" onClick={() => setWindows(Math.max(0, windows - 1))} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all text-base font-bold shadow-sm">-</button>
                                        <span className="font-display font-black text-lg w-6 text-center">{windows}</span>
                                        <button type="button" onClick={() => setWindows(windows + 1)} className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all text-base font-bold shadow-sm">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nº de Manos */}
                        <div className="bg-white/40 dark:bg-slate-950/40 border border-slate-300/30 dark:border-slate-800/30 p-5 rounded-2xl flex flex-col gap-4">
                            <label className="text-[10px] font-display font-bold text-foreground/70 uppercase tracking-[0.2em]">Nº de Manos</label>
                            <div className="flex items-center p-1 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 h-12">
                                {[1, 2, 3].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setLayers(num)}
                                        className={`flex-1 h-full rounded-lg font-display font-black transition-all flex items-center justify-center text-lg ${layers === num
                                                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                                                : 'text-foreground/30 hover:text-foreground'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-8 bg-primary/[0.02] rounded-[2rem] border border-primary/10 text-center relative overflow-hidden group/result">
                    <div className="absolute top-4 right-4">
                        <button type="button" onClick={reset} className="p-2 hover:bg-primary/10 rounded-full text-foreground/20 transition-all hover:text-primary">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mt-2">
                        <span className="text-[9px] font-display font-bold text-primary/40 uppercase tracking-[0.3em] mb-2 block">Volumen Estimado</span>
                        <div className="text-6xl font-display font-black text-primary flex items-baseline justify-center gap-1 mb-1 tracking-tighter">
                            {litersNeeded.toString().split('.')[0]}
                            <span className="text-3xl opacity-40">.{litersNeeded.toString().split('.')[1] || '0'}</span>
                            <span className="text-4xl font-light opacity-60">L</span>
                        </div>
                    </div>

                    {litersNeeded > 0 && recommendation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-primary/10 text-primary text-[9px] font-display font-bold px-4 py-2 rounded-full inline-block uppercase tracking-[0.2em]">
                                Sugeremos: {recommendation.text}
                            </div>

                            {onApplyQuantity && (
                                <button
                                    type="button"
                                    onClick={() => onApplyQuantity(recommendation.qty)}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-display font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Aplicar cantidad
                                </button>
                            )}
                        </motion.div>
                    )}

                    <div className="flex items-start gap-3 text-left bg-white/40 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/30 dark:border-slate-800/30 mt-6 mt-auto">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[9px] text-foreground/40 leading-relaxed font-medium">
                            Cálculo con aberturas estándar. Rendimiento: <span className="text-primary font-bold">{defaultYield} m²/L</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCalculator;
