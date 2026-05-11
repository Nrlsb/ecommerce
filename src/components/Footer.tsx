import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[#1E3773] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-8">
                    {/* Logo Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="block">
                            <Image 
                                src="/images/logos/logomercurio.png" 
                                alt="Mercurio Pinturerías" 
                                width={180} 
                                height={60} 
                                className="h-auto w-auto max-w-[200px]"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Somos Mercurio Column */}
                    <div>
                        <h3 className="font-bold text-base mb-6 uppercase tracking-wider">Somos Mercurio</h3>
                        <ul className="space-y-3 text-sm font-light">
                            <li><Link href="/sobre-mercurio" className="hover:text-mercurio-yellow transition-colors">Sobre Mercurio</Link></li>
                            <li><Link href="/sucursales" className="hover:text-mercurio-yellow transition-colors">Sucursales</Link></li>
                            <li><Link href="/unidades-de-negocio" className="hover:text-mercurio-yellow transition-colors">Unidades de Negocios</Link></li>
                            <li><Link href="/servicios" className="hover:text-mercurio-yellow transition-colors">Servicios</Link></li>
                            <li><Link href="/contacto" className="hover:text-mercurio-yellow transition-colors">Contacto</Link></li>
                            <li><Link href="/terminos" className="hover:text-mercurio-yellow transition-colors">Términos y condiciones</Link></li>
                            <li><Link href="/preguntas-frecuentes" className="hover:text-mercurio-yellow transition-colors">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    {/* Atención al Cliente Column */}
                    <div>
                        <h3 className="font-bold text-base mb-6 uppercase tracking-wider">Ventas Atencion al Cliente</h3>
                        <div className="space-y-4 text-sm">
                            <a href="mailto:consultas@pintureriamercurio.com.ar" className="block font-light hover:text-mercurio-yellow transition-colors underline decoration-white/30 underline-offset-4">
                                consultas@pintureriamercurio.com.ar
                            </a>
                            <div className="space-y-1">
                                <p className="font-bold">Días y horarios de atención:</p>
                                <p className="font-light">08 a 17hs</p>
                            </div>
                        </div>
                    </div>

                    {/* Medios de Pago Column */}
                    <div>
                        <h3 className="font-bold text-base mb-6 uppercase tracking-wider">Medios de Pago</h3>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-3 items-center opacity-90">
                                <Image src="/images/logos/mercadopago.png" alt="Mercado Pago" width={80} height={24} className="h-5 w-auto object-contain brightness-0 invert" />
                                <div className="flex gap-2 items-center bg-white/10 px-2 py-1 rounded">
                                    <span className="text-[10px] font-bold">VISA</span>
                                </div>
                                <div className="flex gap-2 items-center bg-white/10 px-2 py-1 rounded">
                                    <span className="text-[10px] font-bold">NARANJAX</span>
                                </div>
                                <div className="flex gap-2 items-center bg-white/10 px-2 py-1 rounded">
                                    <span className="text-[10px] font-bold">BANELCO</span>
                                </div>
                            </div>
                            <Link href="/promociones" className="text-sm font-light hover:text-mercurio-yellow transition-colors">
                                Ver promociones
                            </Link>
                        </div>
                    </div>

                    {/* Seguinos Column */}
                    <div>
                        <h3 className="font-bold text-base mb-6 uppercase tracking-wider">Seguinos En</h3>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded hover:bg-white hover:text-[#1E3773] transition-all duration-300">
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded hover:bg-white hover:text-[#1E3773] transition-all duration-300">
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded hover:bg-white hover:text-[#1E3773] transition-all duration-300">
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" />
                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-20 pt-8 border-t border-white/10 text-center">
                    <p className="text-[11px] font-light tracking-wide opacity-80 uppercase">
                        © 2021-{new Date().getFullYear()} | MERCURIO - Desarrollo por Dia8Publicidad
                    </p>
                </div>
            </div>
        </footer>
    );
}


