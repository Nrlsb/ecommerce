
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

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

    // Cuando cambia el color o el tamaño, buscar la variante correspondiente
    const handleSelectVariant = (color: string, size: string) => {
        const variant = variants.find(v => v.color === color && v.size === size);
        if (variant) {
            router.push(`/catalogo/${variant.id}`);
        } else {
            // Si no existe esa combinación exacta, al menos cambiar la selección visual
            // y buscar la variante más cercana (mismo color, diferente tamaño o viceversa)
            const nextVariant = variants.find(v => v.color === color) || variants.find(v => v.size === size);
            if (nextVariant) {
                router.push(`/catalogo/${nextVariant.id}`);
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
        <div className="space-y-8 my-8 p-6 bg-muted/20 rounded-3xl border border-border/50">
            {/* Selector de Color */}
            <div>
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-4">
                    Color: <span className="text-foreground">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                        const isSelected = color === selectedColor;
                        const hex = getColorHex(color);
                        return (
                            <button
                                key={color}
                                onClick={() => {
                                    setSelectedColor(color);
                                    handleSelectVariant(color, selectedSize);
                                }}
                                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${
                                    isSelected ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                                }`}
                                title={color}
                            >
                                <div 
                                    className="w-full h-full rounded-full border border-black/10" 
                                    style={{ backgroundColor: hex }}
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Check className={`w-5 h-5 ${hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selector de Tamaño */}
            <div>
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-4">
                    Tamaño (Litros): <span className="text-foreground">{selectedSize}L</span>
                </span>
                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => {
                        const isSelected = size === selectedSize;
                        const hasVariant = variants.some(v => v.color === selectedColor && v.size === size);
                        
                        return (
                            <button
                                key={size}
                                onClick={() => {
                                    if (hasVariant) {
                                        setSelectedSize(size);
                                        handleSelectVariant(selectedColor, size);
                                    }
                                }}
                                disabled={!hasVariant}
                                className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                                    isSelected 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105' 
                                        : hasVariant
                                            ? 'bg-background border-border hover:border-primary/50 text-foreground/60'
                                            : 'bg-muted/50 border-transparent text-foreground/20 cursor-not-allowed'
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
