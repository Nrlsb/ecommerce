'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    HelpCircle, 
    ShoppingBag, 
    CreditCard, 
    Truck, 
    RefreshCw, 
    ShieldCheck, 
    User,
    ArrowLeft,
    ChevronDown,
    Mail,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Definición de las preguntas frecuentes suministradas por el usuario
const FAQS = [
    {
        id: "faq-1",
        category: "compras",
        question: "¿Cómo comprar en Pinturerías Mercurio online?",
        answer: "Ingresá al sitio www.pintureriasmercurio.com.ar y elegí los productos que necesites. Agregalos a tu carrito de compras. Una vez completo el carrito, podes hacer click en el ícono del carrito ubicado arriba a la derecha presionar el botón “Finalizar Compra” donde iniciarás el proceso de compra."
    },
    {
        id: "faq-2",
        category: "seguridad",
        question: "¿Es seguro comprar en nuestra web?",
        answer: "Comprar en www.pintureriasmercurio.com.ar es 100% seguro, gracias a que cuenta con los estándares de seguridad más rigurosos utilizados en el retail mundialmente. Certificado por la empresa líder mundial en seguridad de transacciones comerciales a través de Internet. Tus datos se mantendrán bajo estricta confidencialidad. Pintureriasmercurio utiliza un sistema de seguridad llamado SSL (Secure Socket Layer), que actualmente es el estándar usado por las compañías más importantes del mundo para realizar transacciones electrónicas seguras, lo que significa que toda tu información personal no podrá ser leída ni capturada por terceros mientras viaja por la red."
    },
    {
        id: "faq-3",
        category: "seguridad",
        question: "¿Mis datos personales están seguros?",
        answer: "Sí. Cada usuario dispondrá en todo momento de los derechos de acceso a la información, rectificación y cancelación de sus datos personales conforme a la Ley Nº 25.326 sobre protección de datos de carácter personal. Asimismo, si deseas modificar tu información personal, lo podés realizar ingresando a la opción MI CUENTA y seleccionando alguna de las opciones del menú para modificar los datos que ingresaste cuando te registraste en el sitio.\n\n(Tus datos personales se toman solo con los fines de cumplir con el giro comercial de la empresa, validar las órdenes de compra, mejorar la labor de información y comercialización de los productos y servicios prestados por tiendauniverso.com.ar, realizar acciones de marketing y publicidad. El usuario tiene el derecho gratuito de ejercer el acceso, rectificar y suprimir los datos. La Dirección Nacional de Protección de Datos Personales, órgano de control de la Ley Nro. 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan en relación a incumplimiento de las normas sobre protección de datos personales.)"
    },
    {
        id: "faq-4",
        category: "cuenta",
        question: "¿Cómo me registro en pintureriamercurio.com.ar? ¿Qué beneficios obtengo?",
        answer: "Podés registrarte si sos mayor de edad. Sólo tenés que completar el formulario con tus datos personales en la solapa “Mi cuenta” y luego \"Crear cuenta\". Luego el sistema generará un usuario y contraseña con los que podrás ingresar en las visitas futuras. Una vez que seas usuario registrado de pintureriamercurio.com.ar podrás realizar un seguimiento sobre tus compras, tener mayor agilidad en tus próximos pedidos y recibir información sobre nuestros descuentos y promociones."
    },
    {
        id: "faq-5",
        category: "pagos",
        question: "¿Cuáles son las formas de pago disponibles?",
        answer: "Las formas de pago disponibles son las ofrecidas por el sistema MERCADOPAGO. Las compras serán validadas luego de la confirmación de pago realizada en dicha plataforma."
    },
    {
        id: "faq-6",
        category: "pagos",
        question: "¿Hacen factura A y B?",
        answer: "Al adquirir un producto, la factura electrónica a emitirse será la de consumidor final (comprobantes tipo “B”), siendo esta única modalidad de facturación para la compra on line. La misma será enviada al e-mail informado por el Usuario en el pedido, sin excepción. En caso de necesitar una Factura tipo A, el cliente una vez que tenga el producto, deberá enviarnos los datos para modificar la misma, contestando al mail recibido con la Factura B. Somos agente de Percepción de IIBB por lo que avisaremos si es necesario agregar un monto adicional por este motivo."
    },
    {
        id: "faq-7",
        category: "envios",
        question: "Compré con envío a domicilio ¿cuándo recibo mi pedido?",
        answer: "Si realizaste una compra con envío a domicilio y tu domicilio es en la ciudad de Santa Fe o Rosario lo recibirás 48 hs hábiles posteriores a la compra. Si te encontrás en otras ciudades lo enviaremos a tu domicilio por Correo y tendrá una demora de 5 a 7 días hábiles dependiendo de la localidad donde te encuentres. Estos plazos pueden sufrir variaciones por situaciones ajenas a Pinturerías Mercurio. Si desea saber el estado del mismo, podés enviar un mensaje al teléfono 3496-557824 o enviando la solicitud para coordinar el envío a info@pintureriasmercurio.com.ar. La promoción de envío gratis: Aplica únicamente a productos seleccionados."
    },
    {
        id: "faq-8",
        category: "envios",
        question: "¿Cuánto tiempo tengo para retirar mi pedido en sucursal?",
        answer: "Tenés 30 días para retirar tu pedido en la sucursal seleccionada luego de efectuada la compra."
    },
    {
        id: "faq-9",
        category: "envios",
        question: "¿Cómo hago para saber el estado de mi pedido?",
        answer: "Ingresando el código de seguimiento informado en la factura de compra en el sitio web de Correo Argentino: https://www.correoargentino.com.ar/. Además, podés enviar tu consulta a nuestro correo info@pintureriamercurio.com.ar"
    },
    {
        id: "faq-10",
        category: "cambios",
        question: "Quiero cambiar el producto que compré, ¿puedo?",
        answer: "Sí, podés hacerlo, siempre que tu cambio cumpla con las siguientes condiciones:\n\n1) Tenés 30 días a partir de la fecha de entrega del pedido para comunicarnos tu necesidad de cambiarlo o devolverlo y sus causas.\n\n2) Tu cambio o devolución se debe a alguna de las siguientes causas:\na) El producto recibido no es el que ha sido solicitado.\nb) Existió un error de confección de pedido por parte de pintureriamercurio.com.ar\nc) El producto te llegó dañado.\nd) En todos los casos el producto no podrá haber sido utilizado y deberá contar con su embalaje intacto, exactamente como fue recibido.\ne) Deberá presentarse la copia de la factura para su cancelación.\n\nCumplidas las condiciones anteriormente citadas, se realizará el cambio del producto. En el caso que anules una compra, o si al momento de llegar un pedido se rechaza (por una razón ajena a la responsabilidad de pintureriamercurio.com.ar) y el producto ya ha sido despachado, los costos de envío estarán a cargo del usuario. (*) Ley Nº 26.361, art. 34 (Normas de Protección y Defensa de los Consumidores). Para efectuar el cambio deberán contactarnos mediante vía correo electrónico a info@pintureriasmercurio.com.ar"
    }
];

// Configuración de las categorías
const CATEGORIES = [
    { id: "todas", label: "Todas", icon: HelpCircle },
    { id: "compras", label: "Cómo Comprar", icon: ShoppingBag },
    { id: "pagos", label: "Pagos y Facturas", icon: CreditCard },
    { id: "envios", label: "Envíos y Retiros", icon: Truck },
    { id: "cambios", label: "Cambios y Devoluciones", icon: RefreshCw },
    { id: "seguridad", label: "Seguridad y Privacidad", icon: ShieldCheck },
    { id: "cuenta", label: "Cuenta y Registro", icon: User }
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todas');
    const [openFaqs, setOpenFaqs] = useState<{ [key: string]: boolean }>({});
    const [filteredFaqs, setFilteredFaqs] = useState(FAQS);

    // Filtrar y buscar preguntas frecuentes en tiempo real
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = FAQS.filter(faq => {
            const matchesCategory = selectedCategory === 'todas' || faq.category === selectedCategory;
            const matchesSearch = faq.question.toLowerCase().includes(lowerSearch) || faq.answer.toLowerCase().includes(lowerSearch);
            return matchesCategory && matchesSearch;
        });
        setFilteredFaqs(filtered);
    }, [searchTerm, selectedCategory]);

    // Alternar expansión de una pregunta individual
    const toggleFaq = (id: string) => {
        setOpenFaqs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Función para resaltar el texto buscado
    const highlightText = (text: string, search: string) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return (
            <>
                {parts.map((part, index) => 
                    part.toLowerCase() === search.toLowerCase() ? (
                        <mark key={index} className="bg-mercurio-pink/30 dark:bg-mercurio-pink/50 text-foreground px-1 py-0.5 rounded font-medium border-b-2 border-mercurio-pink/80">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-20">
            
            {/* Header decorativo estilo Premium */}
            <div className="relative overflow-hidden py-20 bg-[#020617] border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                
                {/* Luces decorativas de fondo */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
                    </Link>
                    
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-mercurio-yellow uppercase tracking-widest">
                        Centro de Ayuda
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Preguntas Frecuentes
                    </h1>
                    
                    <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                        ¿Tenés dudas sobre cómo comprar, los medios de pago, el envío o la garantía? Encontrá acá todas las respuestas rápidamente.
                    </p>

                    {/* Buscador de FAQ */}
                    <div className="max-w-2xl mx-auto pt-4 relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-mercurio-pink transition-colors z-20">
                            <Search className="w-full h-full" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar pregunta o palabra clave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-5 py-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-mercurio-pink focus:ring-1 focus:ring-mercurio-pink transition-all font-medium placeholder:text-slate-500 shadow-2xl relative z-10"
                        />
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Categorías (Navegación Lateral) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="glass bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 p-6 rounded-3xl shadow-sm sticky top-28 space-y-4">
                        <h3 className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-white/5 pb-3">
                            Categorías
                        </h3>
                        
                        <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                            {CATEGORIES.map((cat) => {
                                const IconComponent = cat.icon;
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 flex-shrink-0 cursor-pointer ${
                                            isSelected
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md scale-102'
                                                : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <IconComponent className={`w-4 h-4 ${
                                            isSelected 
                                                ? 'text-mercurio-pink' 
                                                : 'text-slate-400'
                                        }`} />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Acordeones de FAQ */}
                <div className="lg:col-span-8 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => {
                                const isOpen = !!openFaqs[faq.id];
                                return (
                                    <motion.div
                                        key={faq.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25, delay: index * 0.03 }}
                                        className={`border rounded-2xl overflow-hidden transition-all duration-350 bg-white dark:bg-slate-900/40 ${
                                            isOpen
                                                ? 'border-mercurio-blue/40 dark:border-mercurio-blue/30 shadow-md shadow-mercurio-blue/5'
                                                : 'border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                                        }`}
                                    >
                                        {/* Botón de la Pregunta */}
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none relative group"
                                        >
                                            {/* Línea decorativa del acordeón activo */}
                                            {isOpen && (
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
                                            )}
                                            
                                            <span className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 group-hover:text-mercurio-pink dark:group-hover:text-mercurio-pink transition-colors pr-4">
                                                {highlightText(faq.question, searchTerm)}
                                            </span>
                                            
                                            <span className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-all duration-300 ${
                                                isOpen ? 'rotate-180 bg-mercurio-pink/10 text-mercurio-pink' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                                            }`}>
                                                <ChevronDown className="w-4 h-4" />
                                            </span>
                                        </button>

                                        {/* Contenido / Respuesta (Con animación de Framer Motion) */}
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                >
                                                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                                                        {highlightText(faq.answer, searchTerm)}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm space-y-4"
                            >
                                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No encontramos resultados</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                                    No encontramos ninguna pregunta que coincida con "{searchTerm}". Intentá con otro término de búsqueda o seleccioná otra categoría.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tarjeta de soporte o dudas no resueltas */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-mercurio-pink/10 to-mercurio-yellow/5 border border-mercurio-pink/20 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8">
                        <div className="space-y-2">
                            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                ¿Seguís con dudas o consultas?
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-light">
                                Nuestro equipo está listo para brindarte el mejor asesoramiento experto.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <a 
                                href="mailto:info@pintureriasmercurio.com.ar"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white hover:bg-slate-950 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
                            >
                                <Mail className="w-4 h-4" />
                                info@pintureriasmercurio.com.ar
                            </a>
                            <a 
                                href="https://wa.me/5493496557824"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
                            >
                                <MessageSquare className="w-4 h-4" />
                                WhatsApp Coordinación
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
