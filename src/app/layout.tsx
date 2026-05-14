import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Pinturerías Mercurio | Expertos en Color y Pintura",
    template: "%s | Pinturerías Mercurio"
  },
  description: "Encuentra la mejor selección de pinturas, esmaltes, impermeabilizantes y accesorios en Pinturerías Mercurio. Calidad profesional y asesoramiento experto para tus proyectos.",
  keywords: ["pintura", "pinturería", "mercurio", "construcción", "hogar", "decoración", "esmaltes", "látex"],
  authors: [{ name: "Mercurio Pinturerías" }],
  creator: "Mercurio Pinturerías",
  publisher: "Mercurio Pinturerías",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Pinturerías Mercurio | Expertos en Color y Pintura",
    description: "Transforma tus espacios con la calidad profesional de Mercurio. Compra online con envío express.",
    url: "https://pintureriamercurio.com.ar",
    siteName: "Pinturerías Mercurio",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinturerías Mercurio",
    description: "Expertos en color y soluciones para tus proyectos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
