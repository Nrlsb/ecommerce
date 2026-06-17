'use client';

import { Truck, ShieldCheck } from 'lucide-react';

interface ShippingData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  provincia: string;
  notes: string;
}

interface BillingData {
  tipo: string;
  nombre: string;
  documento: string;
}

interface ShippingFormProps {
  deliveryMethod: 'envio' | 'retiro';
  setDeliveryMethod: (method: 'envio' | 'retiro') => void;
  shippingData: ShippingData;
  setShippingData: (data: ShippingData) => void;
  billingData: BillingData;
  setBillingData: (data: BillingData) => void;
  errors: Record<string, string>;
  onBackToCart: () => void;
}

export function ShippingForm({
  deliveryMethod,
  setDeliveryMethod,
  shippingData,
  setShippingData,
  billingData,
  setBillingData,
  errors,
  onBackToCart
}: ShippingFormProps) {
  const handleInputChange = (field: keyof ShippingData, value: string) => {
    setShippingData({
      ...shippingData,
      [field]: value
    });
  };

  const handleBillingChange = (field: keyof BillingData, value: string) => {
    setBillingData({
      ...billingData,
      [field]: value
    });
  };

  return (
    <div className="bg-card border border-border p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-2xl font-black text-foreground">Datos de Entrega</h2>
        <button 
          onClick={onBackToCart}
          className="text-primary font-bold text-sm hover:underline cursor-pointer"
        >
          Editar productos
        </button>
      </div>

      {/* Selector de Método de Entrega */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => setDeliveryMethod('envio')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
            deliveryMethod === 'envio' 
              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
              : 'border-border opacity-50 hover:opacity-100'
          }`}
        >
          <Truck className="w-8 h-8 text-primary" />
          <span className="font-bold text-sm sm:text-base">Envío a domicilio</span>
        </button>
        <button 
          type="button"
          onClick={() => setDeliveryMethod('retiro')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
            deliveryMethod === 'retiro' 
              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
              : 'border-border opacity-50 hover:opacity-100'
          }`}
        >
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="font-bold text-sm sm:text-base">Retiro en sucursal</span>
        </button>
      </div>

      {/* Campos de Contacto Comunes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
            Nombre Completo *
          </label>
          <input 
            type="text" 
            className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
              errors.fullName ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
            value={shippingData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Juan Pérez"
          />
          {errors.fullName && (
            <span className="text-destructive text-xs mt-1 block font-medium">{errors.fullName}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
            Email *
          </label>
          <input 
            type="email" 
            className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
              errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
            value={shippingData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="juan@ejemplo.com"
          />
          {errors.email && (
            <span className="text-destructive text-xs mt-1 block font-medium">{errors.email}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
            Teléfono *
          </label>
          <input 
            type="tel" 
            className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
              errors.phone ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
            }`}
            value={shippingData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="11 1234-5678"
          />
          {errors.phone && (
            <span className="text-destructive text-xs mt-1 block font-medium">{errors.phone}</span>
          )}
        </div>

        {/* Campos Específicos para Envío a Domicilio */}
        {deliveryMethod === 'envio' && (
          <>
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                Dirección de Entrega *
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
                  errors.address ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
                value={shippingData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle 123, Piso 1, Depto A"
              />
              {errors.address && (
                <span className="text-destructive text-xs mt-1 block font-medium">{errors.address}</span>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                Provincia *
              </label>
              <select
                className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
                  errors.provincia ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
                value={shippingData.provincia}
                onChange={(e) => handleInputChange('provincia', e.target.value)}
              >
                <option value="">Selecciona tu provincia...</option>
                <option value="caba">CABA (Ciudad Autónoma de Buenos Aires)</option>
                <option value="buenos_aires">Buenos Aires (Provincia)</option>
                <option value="catamarca">Catamarca</option>
                <option value="chaco">Chaco</option>
                <option value="chubut">Chubut</option>
                <option value="cordoba">Córdoba</option>
                <option value="corrientes">Corrientes</option>
                <option value="entre_rios">Entre Ríos</option>
                <option value="formosa">Formosa</option>
                <option value="jujuy">Jujuy</option>
                <option value="la_pampa">La Pampa</option>
                <option value="la_rioja">La Rioja</option>
                <option value="mendoza">Mendoza</option>
                <option value="misiones">Misiones</option>
                <option value="neuquen">Neuquén</option>
                <option value="rio_negro">Río Negro</option>
                <option value="salta">Salta</option>
                <option value="san_juan">San Juan</option>
                <option value="san_luis">San Luis</option>
                <option value="santa_cruz">Santa Cruz</option>
                <option value="santa_fe">Santa Fe</option>
                <option value="santiago_del_estero">Santiago del Estero</option>
                <option value="tierra_del_fuego">Tierra del Fuego</option>
                <option value="tucuman">Tucumán</option>
              </select>
              {errors.provincia && (
                <span className="text-destructive text-xs mt-1 block font-medium">{errors.provincia}</span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                Ciudad
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                value={shippingData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ej. Tandil"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                Código Postal
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                value={shippingData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="1425"
              />
            </div>
          </>
        )}

        <div className="col-span-1 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
            Notas adicionales (opcional)
          </label>
          <textarea 
            rows={3}
            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors resize-none"
            value={shippingData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Indicaciones para el repartidor o sucursal de retiro..."
          />
        </div>
      </div>

      {/* Datos de Facturación */}
      <div className="border-t border-border pt-6 mt-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Datos de Facturación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
              Tipo de Factura
            </label>
            <select
              className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary transition-colors"
              value={billingData.tipo}
              onChange={(e) => handleBillingChange('tipo', e.target.value)}
            >
              <option value="Consumidor Final">Consumidor Final</option>
              <option value="Factura A">Factura A (Responsable Inscripto)</option>
              <option value="Factura B">Factura B</option>
            </select>
          </div>
          
          {billingData.tipo !== 'Consumidor Final' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                  {billingData.tipo === 'Factura A' ? 'Razón Social *' : 'Nombre Completo / Razón Social *'}
                </label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
                    errors.billingNombre ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                  }`}
                  value={billingData.nombre}
                  onChange={(e) => handleBillingChange('nombre', e.target.value)}
                  placeholder="Ej. Pinturerías Mercurio S.A."
                />
                {errors.billingNombre && (
                  <span className="text-destructive text-xs mt-1 block font-medium">{errors.billingNombre}</span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2 block">
                  {billingData.tipo === 'Factura A' ? 'CUIT *' : 'CUIT / CUIL / DNI *'}
                </label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none transition-colors ${
                    errors.billingDocumento ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                  }`}
                  value={billingData.documento}
                  onChange={(e) => handleBillingChange('documento', e.target.value)}
                  placeholder="30-12345678-9"
                />
                {errors.billingDocumento && (
                  <span className="text-destructive text-xs mt-1 block font-medium">{errors.billingDocumento}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
