'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  Clock, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Warehouse, 
  Award, 
  HeartHandshake, 
  Smartphone, 
  Truck, 
  MessageSquare,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function UnidadesDeNegocioClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta Mayorista - Distribuidora ESPINT',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Consulta Mayorista - Distribuidora ESPINT',
          message: '',
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Ocurrió un error inesperado al enviar el mensaje.');
      }
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setSubmitStatus('error');
      setErrorMessage('No pudimos conectar con el servidor. Por favor, verifica tu conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animations variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 80, 
        damping: 15 
      } 
    }
  };

  const services = [
    {
      title: 'Amplio Stock Permanente',
      description: 'Contamos con un volumen de inventario estratégico que nos permite dar respuesta inmediata a sus requerimientos sin demoras de producción.',
      icon: Warehouse,
      color: 'text-mercurio-blue bg-mercurio-blue/10 border-mercurio-blue/20'
    },
    {
      title: 'Marcas Líderes',
      description: 'Disponibilidad absoluta de las marcas más prestigiosas y demandadas del mercado de la pintura, recubrimientos y derivados.',
      icon: Award,
      color: 'text-mercurio-pink bg-mercurio-pink/10 border-mercurio-pink/20'
    },
    {
      title: 'Asesoramiento Técnico Especializado',
      description: 'Nuestro equipo de vendedores cuenta con capacitación constante en el rubro para brindar soluciones exactas a sus necesidades comerciales.',
      icon: HeartHandshake,
      color: 'text-mercurio-green bg-mercurio-green/10 border-mercurio-green/20'
    },
    {
      title: 'Logística de Pedidos Simple',
      description: 'Realice todas sus compras y pedidos a distancia sin moverse de su local vía telefónica, correo electrónico o canales digitales.',
      icon: Smartphone,
      color: 'text-mercurio-yellow bg-mercurio-yellow/10 border-mercurio-yellow/20'
    },
    {
      title: 'Envíos a Todo el País',
      description: 'Garantizamos la distribución y entrega rápida de mercadería a cualquier punto del territorio nacional con transportes de confianza.',
      icon: Truck,
      color: 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20'
    }
  ];

  const salesTeam = [
    {
      name: 'Aldo',
      phone: '+54 9 3496 660664',
      rawPhone: '5493496660664',
      role: 'Ejecutivo de Ventas Mayoristas'
    },
    {
      name: 'Jonatan',
      phone: '+54 9 3496 505822',
      rawPhone: '5493496505822',
      role: 'Ejecutivo de Ventas Mayoristas'
    },
    {
      name: 'Ezequiel',
      phone: '+54 9 342 6280360',
      rawPhone: '5493426280360',
      role: 'Asesor Comercial Mayorista'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 font-sans antialiased pb-24">
      
      {/* Hero Header Section */}
      <div className="relative overflow-hidden py-24 bg-[#020617] border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
        
        {/* Background Glows */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-tr from-mercurio-blue/10 to-mercurio-pink/10 rounded-full blur-3xl opacity-55 pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-35 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white mb-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
          </Link>
          
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-white/5 border border-white/10 text-mercurio-yellow uppercase tracking-widest">
            Nuestros Canales
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Unidades de Negocio
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            Conocé nuestra estructura de distribución mayorista y servicios exclusivos pensados para potenciar el negocio de comerciantes en todo el país.
          </p>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* Distribuidora ESPINT Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass bg-white dark:bg-slate-900/40 p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium relative overflow-hidden group mb-16"
        >
          {/* Internal decorative glows */}
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-gradient-to-br from-mercurio-blue/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-gradient-to-tr from-mercurio-pink/5 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none"></div>

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto text-center">
            <div className="inline-flex p-4 bg-mercurio-blue/10 text-mercurio-blue rounded-3xl mb-2 animate-float">
              <Building2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">
              Distribuidora ESPINT
            </h2>
            <div className="w-16 h-1.5 bg-mercurio-blue mx-auto rounded-full"></div>
            
            <p className="text-base md:text-lg text-slate-650 dark:text-slate-300 font-light leading-relaxed">
              Mediante el departamento de venta mayorista <span className="font-extrabold text-mercurio-blue dark:text-blue-400">ESPINT</span>, ofrecemos una atención exclusiva a comerciantes del rubro; teniendo como meta construir relaciones duraderas en el tiempo brindando para ello asesoramiento, beneficios exclusivos y respuesta inmediata.
            </p>
          </div>
        </motion.div>

        {/* Servicios Section */}
        <div className="space-y-12 mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black tracking-widest text-mercurio-pink uppercase">Distribución y Soporte</span>
            <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Nuestros Servicios Mayoristas
            </h3>
            <div className="w-12 h-1 bg-mercurio-pink mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Ofrecemos soluciones logísticas y comerciales a medida para asegurar el crecimiento y abastecimiento continuo de tu negocio.
            </p>
          </div>

          {/* Services Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="glass bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 shadow-sm flex flex-col justify-between gap-6 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className={`inline-flex p-3.5 rounded-2.5xl ${service.color} transition-transform group-hover:scale-110 duration-300 border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {service.title}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Contact Channels Section */}
        <div className="space-y-12 mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black tracking-widest text-mercurio-green uppercase">Atención Personalizada</span>
            <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Canales de Venta Mayorista
            </h3>
            <div className="w-12 h-1 bg-mercurio-green mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Comunicate directamente con nuestro equipo de asesores comerciales asignados para ventas a comercios.
            </p>
          </div>

          {/* Sales Team & General Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sales Team Contacts Card */}
            <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {salesTeam.map((member, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="glass bg-white dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-mercurio-pink bg-mercurio-pink/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                        Asesor
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light mt-1">
                        {member.role}
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <a
                        href={`https://wa.me/${member.rawPhone}?text=Hola%20${member.name},%20me%20contacto%20desde%20la%20web%20para%20realizar%20una%20consulta%20mayorista%20con%20ESPINT.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-xl text-xs font-bold transition-all duration-300"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <a
                        href={`tel:${member.rawPhone}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all duration-300"
                      >
                        <Phone className="w-3.5 h-3.5" /> Llamar
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* General Contact Info Card */}
              <div className="glass bg-[#020617] text-white p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 mt-4 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-mercurio-green/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-3 text-center md:text-left relative z-10">
                  <span className="text-[9px] font-black text-mercurio-yellow uppercase tracking-widest">
                    Información General ESPINT
                  </span>
                  <h4 className="text-lg font-black uppercase tracking-tight">
                    Correo y Horarios
                  </h4>
                  <p className="text-xs text-slate-400 font-light max-w-md">
                    Para envíos de faxes, comprobantes o consultas administrativas generales, podés escribirnos al correo oficial o visitarnos en nuestros horarios.
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px] relative z-10 w-full md:w-auto">
                  <a
                    href="mailto:espint@pintureriasmercurio.com.ar"
                    className="flex items-center gap-2.5 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 text-xs font-bold"
                  >
                    <Mail className="w-4 h-4 text-mercurio-yellow" />
                    <span className="truncate">espint@pintureriasmercurio.com.ar</span>
                  </a>
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-slate-300">
                    <Clock className="w-4 h-4 text-mercurio-pink" />
                    <span>Lun a Vie: 8:00 a 17:00 hs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Contact Form */}
            <div className="lg:col-span-4">
              <div className="glass bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col justify-between h-full">
                <div className="mb-6">
                  <span className="text-[9px] font-black tracking-widest text-mercurio-blue uppercase bg-mercurio-blue/10 px-2 py-0.5 rounded-full">
                    Formulario
                  </span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-2">
                    Envianos tu Consulta
                  </h4>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-light mt-1">
                    Completá tus datos y un representante de ESPINT se pondrá en contacto a la brevedad.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div
                      key="success-form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-8 space-y-4"
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mx-auto rounded-full flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <h5 className="text-base font-black text-slate-900 dark:text-white uppercase">
                        ¡Mensaje Enviado!
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                        Tu consulta para Distribuidora ESPINT fue recibida. Te responderemos al correo proporcionado lo antes posible.
                      </p>
                      <button
                        onClick={() => setSubmitStatus('idle')}
                        className="inline-flex items-center px-4 py-2 bg-mercurio-blue hover:bg-mercurio-blue/90 text-white font-bold rounded-xl transition-colors uppercase tracking-wider text-[10px]"
                      >
                        Enviar otra consulta
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="active-form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {submitStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] text-red-700 dark:text-red-400 leading-snug">
                            {errorMessage}
                          </span>
                        </div>
                      )}

                      {/* Nombre */}
                      <div>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nombre y Apellido / Razón Social"
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 text-foreground border border-transparent rounded-xl outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium placeholder:text-muted-foreground/60 text-xs shadow-inner"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Correo electrónico"
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 text-foreground border border-transparent rounded-xl outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium placeholder:text-muted-foreground/60 text-xs shadow-inner"
                        />
                      </div>

                      {/* Teléfono */}
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Teléfono de contacto"
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 text-foreground border border-transparent rounded-xl outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium placeholder:text-muted-foreground/60 text-xs shadow-inner"
                        />
                      </div>

                      {/* Asunto */}
                      <div>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 text-foreground border border-transparent rounded-xl outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium text-xs shadow-inner cursor-pointer"
                        >
                          <option value="Consulta Mayorista - Distribuidora ESPINT">Distribuidora ESPINT (Consulta Mayorista)</option>
                          <option value="Ventas Mayoristas">Solicitud de Alta Comercial</option>
                          <option value="Administracion Mayorista">Administración / Pagos</option>
                          <option value="Otros Temas Mayoristas">Otro motivo</option>
                        </select>
                      </div>

                      {/* Mensaje */}
                      <div>
                        <textarea
                          required
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Mensaje de consulta..."
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/50 text-foreground border border-transparent rounded-xl outline-none focus:border-mercurio-blue focus:ring-1 focus:ring-mercurio-blue transition-all font-medium placeholder:text-muted-foreground/60 text-xs resize-none shadow-inner"
                        />
                      </div>

                      {/* Enviar Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-mercurio-blue hover:bg-mercurio-blue/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none text-xs uppercase tracking-wider"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
