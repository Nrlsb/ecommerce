'use client';

import { useState, FC } from 'react';
import { Box, Home, Bed, MousePointer2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomSimulatorProps {
    productName?: string;
    productColor?: string; // Hex color
}

const ROOMS = [
    { id: 'living', name: 'Living Moderno', image: '/simulator/living.png', icon: Home },
    { id: 'bedroom', name: 'Dormitorio Relax', image: '/simulator/bedroom.png', icon: Bed },
];

const COLORS = [
    { name: 'Blanco Nieve', hex: '#F5F5F5' },
    { name: 'Gris Urbano', hex: '#8E9091' },
    { name: 'Azul Marino', hex: '#1B2C41' },
    { name: 'Verde Bosque', hex: '#3D5A4D' },
    { name: 'Terracota', hex: '#A85E46' },
    { name: 'Amarillo Sol', hex: '#EAC05E' },
];

const RoomSimulator: FC<RoomSimulatorProps> = ({ productName, productColor = '#3b82f6' }) => {
    const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
    const [selectedColor, setSelectedColor] = useState(productColor);
    const [intensity, setIntensity] = useState(0.7);

    return (
        <div className="bg-background border border-border rounded-[2.5rem] p-8 shadow-2xl mt-12 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h3 className="font-black text-3xl uppercase tracking-tighter flex items-center gap-3">
                        <Box className="w-8 h-8 text-primary" />
                        Simulador de Ambientes
                    </h3>
                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px] mt-1 pr-1">Visualiza cómo quedará tu próximo proyecto</p>
                </div>

                <div className="flex bg-muted p-1.5 rounded-2xl border border-border/50">
                    {ROOMS.map((room) => {
                        const Icon = room.icon;
                        return (
                            <button
                                key={room.id}
                                onClick={() => setActiveRoom(room)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeRoom.id === room.id
                                        ? 'bg-background text-primary shadow-lg'
                                        : 'text-foreground/40 hover:text-foreground'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{room.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visualizer Area */}
                <div className="lg:col-span-8 relative aspect-[16/10] bg-muted rounded-[2rem] overflow-hidden group shadow-inner border-4 border-muted">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRoom.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={activeRoom.image}
                                alt={activeRoom.name}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Color Overlay Layer - Simulating wall paint */}
                            <div 
                                className="absolute inset-0 pointer-events-none transition-all duration-700"
                                style={{ 
                                    backgroundColor: selectedColor,
                                    opacity: intensity,
                                    mixBlendMode: 'multiply',
                                    // Masking would go here for specific walls, using a gradient for now to simulate focus on the main wall
                                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
                                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Interactive Tags */}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/20">
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: selectedColor }} />
                            <span className="text-xs font-black uppercase text-gray-800">Pared Principal</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 backdrop-blur text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                           <MousePointer2 className="w-3 h-3" /> Haz clic en la pared para pintar
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Color Seleccionado</label>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{productName || 'Color Actual'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c.hex)}
                                    className={`aspect-square rounded-2xl border-4 transition-all transform active:scale-90 ${selectedColor === c.hex ? 'border-primary scale-105' : 'border-transparent'}`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex justify-between">
                            <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Intensidad / Brillo</label>
                            <span className="text-xs font-bold text-primary">{Math.round(intensity * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05" 
                            value={intensity} 
                            onChange={(e) => setIntensity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-tight text-primary">Nota Técnica</h4>
                                <p className="text-[10px] text-foreground/60 leading-relaxed font-medium mt-1">
                                    Los colores mostrados son simulaciones digitales. El resultado real puede variar según la iluminación y textura de la pared.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 transition-all transform active:scale-[0.98]">
                        Comprar este color
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomSimulator;
