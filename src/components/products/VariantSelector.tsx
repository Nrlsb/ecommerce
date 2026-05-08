
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductVariant {
    id: string | number;
    nombre: string;
    precio: number;
    color: string;
    size: string;
}

interface VariantSelectorProps {
    currentProductId: string | number;
    variants: ProductVariant[];
}

export default function VariantSelector({ currentProductId, variants }: VariantSelectorProps) {
    const router = useRouter();

    // Obtener colores y tamaños únicos
    const colors = useMemo(() => {
        const uniqueColors = Array.from(new Set(variants.map(v => v.color)));
        return uniqueColors.sort();
    }, [variants]);

    const sizes = useMemo(() => {
        const uniqueSizes = Array.from(new Set(variants.map(v => v.size)));
        // Ordenar tamaños (intentar numéricamente si es posible)
        return uniqueSizes.sort((a, b) => {
            const numA = parseFloat(a.replace(',', '.'));
            const numB = parseFloat(b.replace(',', '.'));
            return numA - numB;
        });
    }, [variants]);

    // Encontrar la variante actual
    const currentVariant = variants.find(v => String(v.id) === String(currentProductId));
    
    const [selectedColor, setSelectedColor] = useState(currentVariant?.color || '');
    const [selectedSize, setSelectedSize] = useState(currentVariant?.size || '');

    // Sincronizar estado local cuando cambia la variante (por navegación)
    useEffect(() => {
        if (currentVariant) {
            setSelectedColor(currentVariant.color);
            setSelectedSize(currentVariant.size);
        }
    }, [currentVariant]);

    // Cuando cambia el color o el tamaño, buscar la variante correspondiente
    const handleSelectVariant = (color: string, size: string) => {
        const variant = variants.find(v => v.color === color && v.size === size);
        if (variant) {
            router.push(`/catalogo/${variant.id}`, { scroll: false });
        } else {
            // Si no existe esa combinación exacta, al menos cambiar la selección visual
            // y buscar la variante más cercana (mismo color, diferente tamaño o viceversa)
            const nextVariant = variants.find(v => v.color === color) || variants.find(v => v.size === size);
            if (nextVariant) {
                router.push(`/catalogo/${nextVariant.id}`, { scroll: false });
            }
        }
    };

    // Mapeo de colores a hex (aproximado)
    const getColorHex = (colorName: string) => {
        const name = colorName.toLowerCase();
        if (name.includes('blanco')) return '#FFFFFF';
        if (name.includes('negro')) return '#000000';
        if (name.includes('rojo') || name.includes('bermellon')) return '#B22222';
        if (name.includes('verde noche')) return '#004d40';
        if (name.includes('verde')) return '#2E8B57';
        if (name.includes('azul marino')) return '#000080';
        if (name.includes('azul')) return '#4169E1';
        if (name.includes('amarillo')) return '#FFD700';
        if (name.includes('gris')) return '#808080';
        if (name.includes('marron')) return '#8B4513';
        if (name.includes('traful')) return '#008B8B';
        if (name.includes('cedro')) return '#A0522D';
        if (name.includes('roble')) return '#8B4513';
        if (name.includes('caoba')) return '#4B0082';
        if (name.includes('cristal')) return '#F0F8FF';
        return '#CCCCCC'; // Default
    };

    if (variants.length <= 1) return null;

    return (
        <div className="glass p-8 rounded-[2.5rem] border border-white/40 dark:border-white/5 shadow-premium my-12">
            {/* Selector de Color */}
            <div className="mb-10">
                <span className="text-[10px] font-display font-bold text-foreground/30 uppercase tracking-[0.3em] block mb-5 pl-1">
                    Colección de Color: <span className="text-foreground font-black">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-4">
                    {colors.map((color) => {
                        const isSelected = color === selectedColor;
                        const hex = getColorHex(color);
                        return (
                            <button
                                type="button"
                                key={color}
                                onClick={() => {
                                    setSelectedColor(color);
                                    handleSelectVariant(color, selectedSize);
                                }}
                                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center relative p-1 ${
                                    isSelected ? 'border-primary scale-110 shadow-premium' : 'border-transparent hover:scale-110'
                                }`}
                                title={color}
                            >
                                <div 
                                    className="w-full h-full rounded-full border border-black/5 shadow-inner" 
                                    style={{ backgroundColor: hex }}
                                />
                                {isSelected && (
                                    <motion.div layoutId="color-check" className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Check className={`w-6 h-6 ${hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} drop-shadow-md`} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selector de Tamaño */}
            <div>
                <span className="text-[10px] font-display font-bold text-foreground/30 uppercase tracking-[0.3em] block mb-5 pl-1">
                    Presentación: <span className="text-foreground font-black">{selectedSize} Litros</span>
                </span>
                <div className="flex flex-wrap gap-4">
                    {sizes.map((size) => {
                        const isSelected = size === selectedSize;
                        const hasVariant = variants.some(v => v.color === selectedColor && v.size === size);
                        
                        return (
                            <button
                                type="button"
                                key={size}
                                onClick={() => {
                                    if (hasVariant) {
                                        setSelectedSize(size);
                                        handleSelectVariant(selectedColor, size);
                                    }
                                }}
                                disabled={!hasVariant}
                                className={`px-8 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.15em] transition-all border-2 relative overflow-hidden active:scale-95 ${
                                    isSelected 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' 
                                        : hasVariant
                                            ? 'bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 hover:border-primary/40 text-foreground/50'
                                            : 'bg-slate-50/30 border-transparent text-foreground/10 cursor-not-allowed'
                                }`}
                            >
                                {size} L
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
