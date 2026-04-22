import Link from 'next/link';
import { PaintBucket, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <PaintBucket size={24} className="text-primary" />
                            <span className="text-xl font-bold text-primary italic">mercurio</span>
                        </Link>
                        <p className="text-sm text-secondary-foreground/80">
                            Transformando tus espacios con el asesoramiento experto de Pinturerías Mercurio.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Categorías</h3>
                        <ul className="space-y-2 text-sm text-secondary-foreground/80">
                            <li><Link href="#" className="hover:text-primary transition-colors">Pinturas de Interior</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Pinturas de Exterior</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Esmaltes Sintéticos</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Accesorios de Pintura</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Información</h3>
                        <ul className="space-y-2 text-sm text-secondary-foreground/80">
                            <li><Link href="#" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Métodos de Envío</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Políticas de Devolución</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contacto</h3>
                        <ul className="space-y-2 text-sm text-secondary-foreground/80">
                            <li className="flex items-center gap-2"><MapPin size={16} /> Sucursales en Buenos Aires</li>
                            <li className="flex items-center gap-2"><Phone size={16} /> +54 11 0000-0000</li>
                            <li className="flex items-center gap-2"><Mail size={16} /> info@pintureriasmercurio.com.ar</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-secondary-foreground/60">
                    <p>&copy; {new Date().getFullYear()} Pinturerías Mercurio. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
