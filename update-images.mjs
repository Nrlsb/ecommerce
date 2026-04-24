import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargamos las variables de entorno del archivo .env
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: No se encontraron las variables de entorno en el archivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        console.log('📖 Leyendo archivo SQL...');
        const content = fs.readFileSync('product_images_rows (1).sql', 'utf8');

        // Regex para capturar (product_id, 'image_url', 'updated_at', 'product_code')
        const regex = /\(\s*\d+\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g;
        let match;
        const updates = [];

        while ((match = regex.exec(content)) !== null) {
            updates.push({
                imagen_url: match[1], // image_url
                codigo_externo: match[3] // product_code
            });
        }

        if (updates.length === 0) {
            console.log('⚠️ No se encontraron datos válidos en el archivo. Verifica el formato.');
            return;
        }

        console.log(`✅ Se encontraron ${updates.length} productos para actualizar.`);

        const chunkSize = 50;
        for (let i = 0; i < updates.length; i += chunkSize) {
            const chunk = updates.slice(i, i + chunkSize);

            const { error } = await supabase
                .from('productos')
                .upsert(chunk, { onConflict: 'codigo_externo' });

            if (error) {
                console.error(`❌ Error en lote ${Math.floor(i / chunkSize) + 1}:`, error.message);
            } else {
                process.stdout.write(`⏳ Progreso: ${Math.min(i + chunkSize, updates.length)} / ${updates.length} \r`);
            }
        }

        console.log('\n🏁 ¡Proceso completado con éxito!');
    } catch (err) {
        console.error('❌ Error fatal:', err.message);
    }
}

run();
