'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Phone, Mail, Store, Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
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
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Enlace para volver al inicio */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-mercurio-blue transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
        </div>

        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          {/* Banner de Título (Sección CONTACTO) */}
          <motion.div
            variants={itemVariants}
            className="w-full bg-[#1E3773] text-white py-4 px-6 text-center font-bold text-xl md:text-2xl tracking-widest uppercase rounded-lg shadow-md"
          >
            Contacto
          </motion.div>

          {/* Fila de Canales de Contacto (Iconos e información) */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 text-center max-w-5xl mx-auto"
          >
            {/* Teléfono */}
            <div className="flex flex-col items-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                <Phone className="w-6 h-6 text-[#1E3773] dark:text-blue-400" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Teléfonos</h2>
              <a
                href="tel:03496425160"
                className="text-foreground/85 hover:text-mercurio-blue transition-colors font-medium text-sm block"
              >
                Tel/Fax: 03496 - 425160
              </a>
              <a
                href="tel:03496427255"
                className="text-foreground/85 hover:text-mercurio-blue transition-colors font-medium text-sm mt-1 block"
              >
                Tel: 03496 427255
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                <Mail className="w-6 h-6 text-[#1E3773] dark:text-blue-400" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Email</h2>
              <a
                href="mailto:consultas@pintureriamercurio.com.ar"
                className="text-foreground/85 hover:text-mercurio-blue transition-colors font-medium text-sm break-all"
              >
                consultas@pintureriamercurio.com.ar
              </a>
            </div>

            {/* Horarios */}
            <div className="flex flex-col items-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                <Store className="w-6 h-6 text-[#1E3773] dark:text-blue-400" />
              </div>
              <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Horarios</h2>
              <p className="text-foreground/85 font-medium text-sm">
                08 a 17hs
              </p>
              <p className="text-xs text-muted-foreground mt-1">Lunes a Viernes</p>
            </div>
          </motion.div>

          {/* Formulario de Contacto */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-green-200 dark:border-green-900/50 p-8 md:p-12 rounded-[2.5rem] text-center shadow-lg max-w-2xl mx-auto"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mx-auto rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-muted-foreground mb-8 text-base">
                    Tu mensaje ha sido recibido con éxito. Nos pondremos en contacto contigo lo antes posible para responder tu consulta. ¡Gracias por confiar en Pinturerías Mercurio!
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="inline-flex items-center px-6 py-3 bg-[#1E3773] text-white hover:bg-[#1E3773]/90 font-bold rounded-xl transition-colors uppercase tracking-widest text-xs shadow-md"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">Error al enviar el formulario</h4>
                        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-1">
                      <input
                        required
                        type="text"
                        name="name"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/60 text-foreground border border-transparent rounded-lg outline-none focus:border-[#1E3773] focus:ring-1 focus:ring-[#1E3773] transition-all font-medium placeholder:text-muted-foreground/60 text-sm shadow-inner"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <input
                        required
                        type="email"
                        name="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/60 text-foreground border border-transparent rounded-lg outline-none focus:border-[#1E3773] focus:ring-1 focus:ring-[#1E3773] transition-all font-medium placeholder:text-muted-foreground/60 text-sm shadow-inner"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1">
                      <input
                        type="tel"
                        name="phone"
                        id="contact-phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/60 text-foreground border border-transparent rounded-lg outline-none focus:border-[#1E3773] focus:ring-1 focus:ring-[#1E3773] transition-all font-medium placeholder:text-muted-foreground/60 text-sm shadow-inner"
                      />
                    </div>

                    {/* Asunto */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        name="subject"
                        id="contact-subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Asunto"
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/60 text-foreground border border-transparent rounded-lg outline-none focus:border-[#1E3773] focus:ring-1 focus:ring-[#1E3773] transition-all font-medium placeholder:text-muted-foreground/60 text-sm shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-1">
                    <textarea
                      required
                      name="message"
                      id="contact-message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mensaje"
                      className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/60 text-foreground border border-transparent rounded-lg outline-none focus:border-[#1E3773] focus:ring-1 focus:ring-[#1E3773] transition-all font-medium placeholder:text-muted-foreground/60 text-sm resize-none shadow-inner"
                    />
                  </div>

                  {/* Botón de Enviar */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-3 border border-[#1E3773] text-[#1E3773] hover:bg-[#1E3773] hover:text-white dark:border-[#3b82f6] dark:text-[#3b82f6] dark:hover:bg-[#3b82f6] dark:hover:text-slate-950 font-semibold tracking-wider transition-all duration-300 disabled:opacity-50 min-w-[160px] flex items-center justify-center gap-2 cursor-pointer select-none text-sm uppercase"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
