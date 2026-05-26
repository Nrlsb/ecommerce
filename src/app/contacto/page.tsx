import { Metadata } from 'next';
import ContactoClient from './ContactoClient';

export const metadata: Metadata = {
  title: 'Contacto | Pinturerías Mercurio',
  description: 'Ponte en contacto con Pinturerías Mercurio. Encuentra nuestros teléfonos de atención, correo electrónico de consultas, horarios de atención y envíanos tu mensaje directamente.',
  keywords: ['contacto', 'teléfono', 'email', 'dirección', 'horarios', 'consultas', 'Mercurio Pinturerías'],
  openGraph: {
    title: 'Contacto | Pinturerías Mercurio',
    description: 'Ponte en contacto con Pinturerías Mercurio. Encuentra nuestros teléfonos, correo de consultas, horarios y envíanos tu mensaje.',
    url: 'https://pintureriamercurio.com.ar/contacto',
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
