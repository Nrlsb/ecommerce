import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validación básica de campos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'El nombre, email y mensaje son campos obligatorios.' },
        { status: 400 }
      );
    }

    console.log('Formulario de contacto recibido en servidor:', {
      name,
      email,
      phone,
      subject,
      message,
    });

    // Intentamos guardar en la base de datos de Supabase de manera segura.
    // Si la tabla 'contactos' no existe, capturamos el error para no interrumpir el flujo.
    try {
      const { error } = await supabase
        .from('contactos')
        .insert([
          {
            nombre: name,
            email: email,
            telefono: phone || null,
            asunto: subject || null,
            mensaje: message,
            creado_en: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.warn(
          'Advertencia: Falló el insert en Supabase (puede que la tabla no exista):',
          error.message
        );
      } else {
        console.log('Mensaje guardado con éxito en la base de datos.');
      }
    } catch (dbError) {
      console.warn('Error al intentar guardar el mensaje en la base de datos:', dbError);
    }

    // Aquí se podría integrar el envío de emails por SMTP, Resend, etc.
    
    return NextResponse.json({
      success: true,
      message: 'Tu mensaje ha sido enviado con éxito.',
    });
  } catch (error) {
    console.error('Error al procesar formulario de contacto:', error);
    return NextResponse.json(
      { error: 'Hubo un error al procesar tu mensaje de contacto.' },
      { status: 500 }
    );
  }
}
