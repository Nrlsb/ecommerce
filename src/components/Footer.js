import Link from 'next/link';
import { PaintBucket, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <PaintBucket size={24} className="text-primary" />
                            <span className="text-xl font-bold">ColorShop</span>
                        </Link>
                        <p className="text-sm text-secondary-foreground/80">
                            Transformando espacios con los mejores colores y la mayor calidad del mercado.
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
                            <li>Av. Los Pintores 1234, Ciudad</li>
                            <li>+54 11 1234-5678</li>
                            <li>contacto@colorshop.ejemplo.com</li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-secondary-foreground/60">
                    <p>&copy; {new Date().getFullYear()} ColorShop. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
