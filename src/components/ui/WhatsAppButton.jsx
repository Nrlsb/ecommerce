'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = "5491122334455"; // Reemplazar con número real
    const message = encodeURIComponent("Hola! Vi su tienda online y me gustaría hacer una consulta sobre los productos.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#128C7E] transition-colors group"
            title="Envíanos un WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute right-full mr-3 bg-white text-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                ¿Necesitas ayuda? Chatea con nosotros
            </span>
        </motion.a>
    );
}
