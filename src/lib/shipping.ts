import { supabaseAdmin } from './supabase-admin';

export interface CartItem {
    id: number | string;
    quantity: number;
}

export interface ShippingRate {
    Tipo: string;
    Provincia: string;
    Localizacion: string;
    "Peso Desde": number | string;
    "Peso Hasta": number | string;
    Valor: number | string;
    Activo: string;
    "Codigo Postal": string;
}

export const PROVINCIA_MAP: Record<string, { code: string; localizacion: string }> = {
    'caba': { code: 'BA', localizacion: 'CAPITAL' },
    'buenos_aires': { code: 'BA', localizacion: 'RESTO PCIA' },
    'catamarca': { code: 'CA', localizacion: 'TODOS' },
    'chaco': { code: 'CH', localizacion: 'TODOS' },
    'chubut': { code: 'CB', localizacion: 'TODOS' },
    'cordoba': { code: 'CO', localizacion: 'TODOS' },
    'corrientes': { code: 'CR', localizacion: 'TODOS' },
    'entre_rios': { code: 'ER', localizacion: 'TODOS' },
    'formosa': { code: 'FO', localizacion: 'TODOS' },
    'jujuy': { code: 'JU', localizacion: 'TODOS' },
    'la_pampa': { code: 'LP', localizacion: 'TODOS' },
    'la_rioja': { code: 'LR', localizacion: 'TODOS' },
    'mendoza': { code: 'ME', localizacion: 'TODOS' },
    'misiones': { code: 'MI', localizacion: 'TODOS' },
    'neuquen': { code: 'NE', localizacion: 'TODOS' },
    'rio_negro': { code: 'RN', localizacion: 'TODOS' },
    'salta': { code: 'SA', localizacion: 'TODOS' },
    'san_juan': { code: 'SJ', localizacion: 'TODOS' },
    'san_luis': { code: 'SL', localizacion: 'TODOS' },
    'santa_cruz': { code: 'SC', localizacion: 'TODOS' },
    'santa_fe': { code: 'SF', localizacion: 'TODOS' },
    'santiago_del_estero': { code: 'SE', localizacion: 'TODOS' },
    'tierra_del_fuego': { code: 'TF', localizacion: 'TODOS' },
    'tucuman': { code: 'TU', localizacion: 'TODOS' }
};

export const DEFAULT_FALLBACK_COST = 8500;
export const FREE_SHIPPING_THRESHOLD = 50000;

/**
 * Calcula el costo de envío de manera unificada y segura en el servidor.
 */
export async function calculateShippingCost({
    items,
    provincia,
    totalCompra
}: {
    items: CartItem[];
    provincia: string;
    totalCompra?: number;
}): Promise<{ costoEnvio: number; esGratis: boolean; pesoTotal: number }> {
    // 1. Validar umbral de envío gratis
    if (totalCompra && totalCompra >= FREE_SHIPPING_THRESHOLD) {
        return { costoEnvio: 0, esGratis: true, pesoTotal: 0 };
    }

    const key = provincia.toLowerCase().trim();
    const provMapping = PROVINCIA_MAP[key];

    if (!provMapping) {
        throw new Error(`Provincia '${provincia}' no soportada para cálculo de envío.`);
    }

    // 2. Obtener pesos de los productos desde la base de datos
    const itemIds = items.map((item) => item.id);
    const { data: dbProducts, error: dbError } = await supabaseAdmin
        .from('productos')
        .select('id, peso')
        .in('id', itemIds);

    if (dbError || !dbProducts) {
        console.error('Error al obtener pesos en calculateShippingCost:', dbError);
        return { costoEnvio: DEFAULT_FALLBACK_COST, esGratis: false, pesoTotal: 0.5 };
    }

    // 3. Calcular el peso total
    let pesoTotal = 0;
    items.forEach((item) => {
        const dbProduct = dbProducts.find((p) => p.id === item.id);
        const pesoUnitario = dbProduct && dbProduct.peso ? Number(dbProduct.peso) : 0.5;
        pesoTotal += pesoUnitario * item.quantity;
    });

    if (pesoTotal <= 0) pesoTotal = 0.5;

    // 4. Consultar tarifas externas
    let rates: ShippingRate[] = [];
    try {
        const response = await fetch('http://119.8.78.68:9078/rest/MERWS01H/', {
            next: { revalidate: 3600 } // Cache por 1 hora
        });
        if (response.ok) {
            rates = await response.json();
        } else {
            throw new Error('API de tarifas no disponible');
        }
    } catch (e) {
        console.error('Fallo al obtener tarifas en calculateShippingCost, aplicando default:', e);
        return { costoEnvio: DEFAULT_FALLBACK_COST, esGratis: false, pesoTotal };
    }

    // 5. Encontrar tarifa coincidente
    const matchingRates = rates.filter((rate) => 
        rate.Activo === 'SI' &&
        rate.Tipo === 'ENTREGA EN DOMICILIO' &&
        rate.Provincia === provMapping.code &&
        (provMapping.localizacion === 'TODOS' || rate.Localizacion === provMapping.localizacion)
    );

    if (matchingRates.length === 0) {
        return { costoEnvio: DEFAULT_FALLBACK_COST, esGratis: false, pesoTotal };
    }

    let selectedRate: ShippingRate | null = null;
    let maxWeight = 0;
    let maxWeightRate: ShippingRate | null = null;

    for (const rate of matchingRates) {
        const pesoDesde = Number(rate['Peso Desde']);
        const pesoHasta = Number(rate['Peso Hasta']);

        if (pesoHasta > maxWeight) {
            maxWeight = pesoHasta;
            maxWeightRate = rate;
        }

        if (pesoTotal >= pesoDesde && pesoTotal <= pesoHasta) {
            selectedRate = rate;
            break;
        }
    }

    let costoCalculado = 0;

    if (selectedRate) {
        costoCalculado = Number(selectedRate.Valor);
    } else if (maxWeightRate && pesoTotal > maxWeight) {
        const costoBase = Number(maxWeightRate.Valor);
        const adicionalRate = rates.find(r => r.Tipo === 'ADICIONAL');
        const adicionalValor = adicionalRate ? Number(adicionalRate.Valor) : 154.65;
        
        const pesoExcedente = pesoTotal - maxWeight;
        costoCalculado = costoBase + (pesoExcedente * adicionalValor);
    } else {
        costoCalculado = DEFAULT_FALLBACK_COST;
    }

    return {
        costoEnvio: Math.round(costoCalculado * 100) / 100,
        esGratis: false,
        pesoTotal: Math.round(pesoTotal * 100) / 100
    };
}
