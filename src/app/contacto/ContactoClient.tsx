'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Phone, Mail, Store, Send, CheckCircle2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ContactoClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          subject: '',
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
  const pageVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };  return (
    <div className="min-h-screen bg-muted/20 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-mercurio-pink opacity-[0.05] rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-mercurio-blue opacity-[0.05] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

      {/* Floating Paint Drops */}
      <motion.div 
        animate={{
          y: [0, -15, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-mercurio-yellow/5 blur-2xl pointer-events-none"
      />
      <motion.div 
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-mercurio-green/5 blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Enlace para volver al inicio */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1.5 transition-transform" />
            Volver al Inicio
          </Link>
        </div>

        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-16"
        >
          {/* Header / Hero Section con estética Premium */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden py-14 px-8 bg-[#020617] border border-white/5 rounded-3xl text-center shadow-premium"
          >
            {/* Línea superior con gradiente de la marca */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-mercurio-blue via-mercurio-pink to-mercurio-yellow"></div>
            
            {/* Background Glows */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-tr from-mercurio-pink/15 to-mercurio-blue/5 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-mercurio-yellow/5 to-mercurio-pink/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-white/5 border border-white/10 text-mercurio-pink uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Atención al Cliente
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white via-slate-200 to-slate-450 bg-clip-text text-transparent">
                Contacto
              </h1>
              <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">
                Estamos aquí para ayudarte. Comunicate con nuestros asesores comerciales o envianos un mensaje directamente.
              </p>
            </div>
          </motion.div>

          {/* Fila de Canales de Contacto (Iconos e información) */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 text-center max-w-5xl mx-auto"
          >
            {/* Teléfono */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-mercurio-blue/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="p-4 bg-mercurio-blue/10 text-mercurio-blue rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">Teléfonos</h2>
              <a
                href="tel:03496425160"
                className="text-foreground/85 hover:text-primary transition-colors font-bold text-sm block"
              >
                Tel/Fax: 03496 - 425160
              </a>
              <a
                href="tel:03496427255"
                className="text-foreground/85 hover:text-primary transition-colors font-bold text-sm mt-1.5 block"
              >
                Tel: 03496 427255
              </a>
            </motion.div>

            {/* Email */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-mercurio-pink/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="p-4 bg-mercurio-pink/10 text-mercurio-pink rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">Email</h2>
              <a
                href="mailto:consultas@pintureriamercurio.com.ar"
                className="text-foreground/85 hover:text-primary transition-colors font-bold text-sm break-all leading-normal"
              >
                consultas@<wbr />pintureriamercurio.com.ar
              </a>
            </motion.div>

            {/* Horarios */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-premium flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-mercurio-yellow/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="p-4 bg-mercurio-yellow/10 text-mercurio-yellow rounded-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">Horarios</h2>
              <p className="text-foreground/85 font-black text-sm uppercase">
                08:00 a 17:00 hs
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-light">Lunes a Viernes</p>
            </motion.div>
          </motion.div>

          {/* Formulario de Contacto */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-green-250 dark:border-green-900/30 p-10 md:p-14 rounded-[2.5rem] text-center shadow-premium max-w-2xl mx-auto"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-muted-foreground mb-10 text-sm md:text-base font-light leading-relaxed">
                    Tu mensaje ha sido recibido con éxito. Nos pondremos en contacto contigo lo antes posible para responder tu consulta. ¡Gracias por confiar en Pinturerías Mercurio!
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/95 font-bold rounded-full transition-all hover:scale-105 uppercase tracking-widest text-xs shadow-lg cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="contact-form-container"
                  className="bg-card border border-border shadow-premium rounded-[2.5rem] p-8 md:p-12 relative premium-border-hover"
                >
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 flex items-start gap-3.5"
                      >
                        <AlertCircle className="w-5 h-5 text-red-650 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-red-800 dark:text-red-450 text-sm">Error al enviar el formulario</h4>
                          <p className="text-red-705 dark:text-red-400 text-sm mt-1 font-light leading-relaxed">{errorMessage}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Nombre */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1 block">Nombre Completo</label>
                        <input
                          required
                          type="text"
                          name="name"
                          id="contact-name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className="w-full px-5 py-4 bg-muted/30 text-foreground border border-border/65 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1 block">Correo Electrónico</label>
                        <input
                          required
                          type="email"
                          name="email"
                          id="contact-email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="w-full px-5 py-4 bg-muted/30 text-foreground border border-border/65 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1 block">Teléfono (Opcional)</label>
                        <input
                          type="tel"
                          name="phone"
                          id="contact-phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Cod. Área + Número"
                          className="w-full px-5 py-4 bg-muted/30 text-foreground border border-border/65 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                        />
                      </div>

                      {/* Asunto */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1 block">Asunto de Consulta</label>
                        <input
                          type="text"
                          name="subject"
                          id="contact-subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="¿En qué podemos ayudarte?"
                          className="w-full px-5 py-4 bg-muted/30 text-foreground border border-border/65 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Mensaje */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-1 block">Tu Mensaje</label>
                      <textarea
                        required
                        name="message"
                        id="contact-message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full px-5 py-4 bg-muted/30 text-foreground border border-border/65 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder:text-muted-foreground/40 text-sm resize-none shadow-inner leading-relaxed"
                      />
                    </div>

                    {/* Botón de Enviar */}
                    <div className="flex justify-center pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-14 py-4 bg-accent text-accent-foreground font-black tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 min-w-[200px] flex items-center justify-center gap-2 cursor-pointer select-none text-xs uppercase shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 active:scale-95 btn-premium-glow btn-premium-glow-pink"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
