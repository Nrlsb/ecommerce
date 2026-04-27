import fs from 'fs';
import path from 'path';

/**
 * Lee el archivo SQL de imágenes y devuelve un Map de código_externo -> url_imagen
 */
export function getCorrectImagesMap(): Map<string, string> {
  const imagesMap = new Map<string, string>();
  
  try {
    const filePath = path.join(process.cwd(), 'product_images_rows (1).sql');
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo de imágenes no encontrado en: ${filePath}`);
      return imagesMap;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Regex para capturar (product_id, 'image_url', 'updated_at', 'product_code')
    // El formato es: (888589, 'https://...', '2026-02-04...', '005837')
    const regex = /\(\s*\d+\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const imageUrl = match[1];
      const productCode = match[3];
      
      if (imageUrl && productCode) {
        imagesMap.set(productCode, imageUrl);
      }
    }

    console.log(`✅ Se cargaron ${imagesMap.size} mapeos de imágenes desde el SQL.`);
  } catch (error) {
    console.error('❌ Error al procesar el archivo SQL de imágenes:', error);
  }

  return imagesMap;
}
