'use client';

import { useState, useEffect, FC } from 'react';
import { Star, Camera, Send, UserCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: string;
    usuario_nombre: string;
    calificacion: number;
    comentario: string;
    imagen_url?: string;
    created_at: string;
}

interface ReviewSectionProps {
    productId: number;
}

const ReviewSection: FC<ReviewSectionProps> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('resenas')
            .select('*')
            .eq('producto_id', productId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setReviews(data);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = '';

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${productId}-${Math.random()}.${fileExt}`;
                const filePath = `resenas/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('resenas')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('resenas')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrl;
            }

            const { error: insertError } = await supabase
                .from('resenas')
                .insert([
                    {
                        producto_id: productId,
                        usuario_nombre: name,
                        calificacion: rating,
                        comentario: comment,
                        imagen_url: imageUrl
                    }
                ]);

            if (insertError) throw insertError;

            // Reset form
            setName('');
            setRating(5);
            setComment('');
            setImage(null);
            setShowForm(false);
            fetchReviews();

        } catch (error) {
            console.error('Error al subir reseña:', error);
            alert('Error al enviar la reseña. ¿Ya creaste el bucket "resenas" en Supabase?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-20 border-t border-border pt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">Reseñas de Clientes</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={20} fill={s <= 4 ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">{reviews.length} opiniones</span>
                    </div>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    {showForm ? 'Cancelar' : 'Escribir Reseña'}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-16"
                    >
                        <form onSubmit={handleSubmit} className="bg-muted/50 border border-border p-8 rounded-[2.5rem] space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Tu Nombre</label>
                                        <input
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-6 py-4 bg-background border-2 border-border/50 rounded-2xl outline-none focus:border-primary transition-colors font-bold"
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Calificación</label>
                                        <div className="flex gap-4">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setRating(s)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-background border border-border text-foreground/20'}`}
                                                >
                                                    <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Foto de tu proyecto (Opcional)</label>
                                        <div className="relative h-28 border-2 border-dashed border-border/50 rounded-2xl flex items-center justify-center bg-background/50 hover:bg-background transition-colors cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            {image ? (
                                                <div className="flex items-center gap-3 text-primary font-bold">
                                                    <ImageIcon className="w-6 h-6" />
                                                    <span className="text-sm truncate max-w-[200px]">{image.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-foreground/20 group-hover:text-primary transition-colors">
                                                    <Camera className="w-8 h-8 mb-1" />
                                                    <span className="text-[10px] font-black uppercase">Subir Foto</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Tu Comentario</label>
                                <textarea
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full px-6 py-4 bg-background border-2 border-border/50 rounded-2xl outline-none focus:border-primary transition-colors font-bold"
                                    placeholder="Cuéntanos tu experiencia con este producto..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" /> Enviar Reseña
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-primary/20" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-border/50">
                    <UserCircle className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
                    <p className="font-bold text-foreground/40 uppercase tracking-widest">Aún no hay reseñas para este producto.</p>
                    <p className="text-xs text-foreground/20 mt-2">¡Sé el primero en compartir tu experiencia!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-background border border-border p-8 rounded-[2rem] flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black uppercase">
                                        {review.usuario_nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-tight">{review.usuario_nombre}</h4>
                                        <p className="text-[10px] text-foreground/40 font-bold">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} fill={review.calificacion >= s ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-foreground/70 leading-relaxed italic">"{review.comentario}"</p>

                            {review.imagen_url && (
                                <div className="mt-auto aspect-video rounded-2xl overflow-hidden border border-border">
                                    <img src={review.imagen_url} alt="Proyecto terminado" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
