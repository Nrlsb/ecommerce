import { Metadata } from 'next';
import UnidadesDeNegocioClient from './UnidadesDeNegocioClient.tsx';

export const metadata: Metadata = {
  title: 'Unidades de Negocio | Pinturerías Mercurio',
  description: 'Conocé las unidades de negocio de Pinturerías Mercurio. Distribuidora ESPINT, venta mayorista y atención exclusiva a comerciantes con envíos a todo el país.',
  keywords: ['distribuidora espint', 'venta mayorista', 'unidades de negocio', 'pinturerias mercurio', 'distribuidora pintura', 'santa fe', 'servicios pintureria'],
  openGraph: {
    title: 'Unidades de Negocio | Pinturerías Mercurio',
    description: 'Conocé las unidades de negocio de Pinturerías Mercurio. Distribuidora ESPINT, venta mayorista y atención exclusiva a comerciantes.',
    url: 'https://pintureriasmercurio.com.ar/unidades-de-negocio',
  },
};

export default function UnidadesDeNegocioPage() {
  return <UnidadesDeNegocioClient />;
}
