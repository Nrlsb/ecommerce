import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="relative bg-[#0f172a] text-white pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow opacity-70"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-mercurio-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-mercurio-pink/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-12">
                    {/* Logo & Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="inline-block group transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/images/logos/logomercurio.png"
                                alt="Mercurio Pinturerías"
                                width={180}
                                height={60}
                                className="h-auto w-auto max-w-[200px] drop-shadow-2xl"
                                priority
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            Expertos en color y soluciones para tus proyectos. Transformando espacios desde 2021.
                        </p>
                    </div>

                    {/* Somos Mercurio Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Somos Mercurio
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-mercurio-yellow"></span>
                        </h3>
                        <ul className="space-y-4 text-sm">
                            {[
                                { name: 'Sobre Mercurio', href: '/sobre-mercurio' },
                                { name: 'Sucursales', href: '/sucursales' },
                                { name: 'Unidades de Negocio', href: '/unidades-de-negocio' },
                                { name: 'Servicios', href: '/servicios' },
                                { name: 'Contacto', href: '/contacto' },
                                { name: 'Términos y condiciones', href: '/terminos' },
                                { name: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-mercurio-yellow transition-all duration-300 flex items-center group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-mercurio-yellow mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Atención al Cliente Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Atención al Cliente
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-mercurio-pink"></span>
                        </h3>
                        <div className="space-y-6 text-sm">
                            <a href="mailto:consultas@pintureriamercurio.com.ar" className="block text-slate-300 hover:text-white transition-colors">
                                <span className="block text-slate-500 mb-1 text-[10px] uppercase tracking-widest font-bold">Email</span>
                                <span className="text-sm font-medium border-b border-white/10 pb-1">consultas@pintureriamercurio.com.ar</span>
                            </a>
                            <div className="space-y-2">
                                <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold">Horarios</span>
                                <p className="text-slate-300 font-light">Lunes a Viernes</p>
                                <p className="text-white font-semibold text-lg">08:00 a 17:00 hs</p>
                            </div>
                        </div>
                    </div>

                    {/* Medios de Pago Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Medios de Pago
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-mercurio-blue"></span>
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 items-center">
                                {['VISA', 'MASTERCARD', 'AMEX', 'NARANJAX', 'BANELCO'].map((card) => (
                                    <div key={card} className="bg-slate-800/50 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-md">
                                        <span className="text-[10px] font-bold tracking-tighter text-slate-300">{card}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/promociones" className="inline-flex items-center text-xs font-medium text-mercurio-yellow hover:text-white transition-colors group">
                                Ver promociones bancarias
                                <svg className="ml-2 w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Seguinos Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-8 uppercase tracking-[0.2em] relative inline-block">
                            Seguinos En
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-mercurio-green"></span>
                        </h3>
                        <div className="flex gap-4">
                            <SocialLink
                                href="https://www.facebook.com/pintureriasmercurio/"
                                icon={<FacebookIcon />}
                                label="Facebook"
                                hoverColor="hover:bg-[#1877F2]"
                            />
                            <SocialLink
                                href="https://www.instagram.com/pint_mercurio/"
                                icon={<InstagramIcon />}
                                label="Instagram"
                                hoverColor="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                            />
                            <SocialLink
                                href="https://www.youtube.com/channel/UCRMyNc7T6iKYVT-7WQgLS7w"
                                icon={<YoutubeIcon />}
                                label="YouTube"
                                hoverColor="hover:bg-[#FF0000]"
                            />
                        </div>
                    </div>
                </div>

                {/* Marco Legal y Fiscal */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Botón de Arrepentimiento */}
                    <div className="flex flex-col items-start gap-2">
                        <Link href="/arrepentimiento" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group shadow-sm">
                            <span className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-mercurio-pink transition-colors">
                                Botón de Arrepentimiento
                            </span>
                        </Link>
                        <span className="text-[10px] text-slate-500 font-medium">
                            Defensa de las y los Consumidores. Para reclamos ingrese <a href="https://autogestion.produccion.gob.ar/consumidor" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">aquí</a>.
                        </span>
                    </div>

                    {/* Data Fiscal ARCA/AFIP */}
                    <div className="flex items-center gap-4">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity bg-white p-1 rounded-md" title="Data Fiscal">
                            {/* Reemplazar src con la URL real o imagen local del código QR de Data Fiscal */}
                            <img src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="Data Fiscal" className="w-10 h-auto object-contain" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
                        © 2021-{new Date().getFullYear()} | MERCURIO PINTRURERÍAS
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">Desarrollado por</span>
                        <a href="#" className="text-[10px] font-bold text-white hover:text-mercurio-yellow transition-colors">Pinturerias Mercurio</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label, hoverColor }: { href: string; icon: React.ReactNode; label: string; hoverColor: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-12 h-12 flex items-center justify-center bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-xl text-white transition-all duration-500 ${hoverColor} hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group`}
        >
            <div className="transform group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
        </a>
    );
}

function FacebookIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
        </svg>
    );
}



