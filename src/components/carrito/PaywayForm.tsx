'use client';

import { CreditCard, AlertTriangle } from 'lucide-react';

interface CardData {
  cardNumber: string;
  cardHolderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  cardHolderIdentificationNumber: string;
  cardHolderIdentificationType: string;
}

interface PaywayFormProps {
  cardData: CardData;
  setCardData: (data: CardData) => void;
  installments: number;
  setInstallments: (inst: number) => void;
  paywayError: string | null;
  finalPrice: number;
}

export function PaywayForm({
  cardData,
  setCardData,
  installments,
  setInstallments,
  paywayError,
  finalPrice
}: PaywayFormProps) {
  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData({
      ...cardData,
      [field]: value
    });
  };

  const handleCardNumberChange = (value: string) => {
    let val = value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    handleInputChange('cardNumber', val);
  };

  return (
    <div className="border border-border p-5 rounded-2xl bg-card space-y-4 shadow-sm">
      <h3 className="font-bold text-foreground text-sm flex items-center gap-2 border-b border-border/50 pb-2">
        <CreditCard size={16} className="text-primary" /> Datos de la Tarjeta
      </h3>
      
      {paywayError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>{paywayError}</span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
            Número de Tarjeta
          </label>
          <input 
            type="text" 
            maxLength={19}
            className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm font-mono"
            value={cardData.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="4507 9900 1234 5678"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
            Nombre del Titular (como figura en la tarjeta)
          </label>
          <input 
            type="text" 
            className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm uppercase"
            value={cardData.cardHolderName}
            onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
            placeholder="JUAN PEREZ"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
              Mes Venc.
            </label>
            <input 
              type="text" 
              maxLength={2}
              className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm text-center"
              value={cardData.cardExpirationMonth}
              onChange={(e) => handleInputChange('cardExpirationMonth', e.target.value.replace(/\D/g, ''))}
              placeholder="MM"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
              Año Venc.
            </label>
            <input 
              type="text" 
              maxLength={2}
              className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm text-center"
              value={cardData.cardExpirationYear}
              onChange={(e) => handleInputChange('cardExpirationYear', e.target.value.replace(/\D/g, ''))}
              placeholder="AA"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
              Cód. Seg.
            </label>
            <input 
              type="password" 
              maxLength={4}
              className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm text-center font-mono"
              value={cardData.securityCode}
              onChange={(e) => handleInputChange('securityCode', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
              Doc. Tipo
            </label>
            <select
              className="w-full px-3 py-2.5 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-xs"
              value={cardData.cardHolderIdentificationType}
              onChange={(e) => handleInputChange('cardHolderIdentificationType', e.target.value)}
            >
              <option value="dni">DNI</option>
              <option value="cuit">CUIT</option>
              <option value="lc">LC</option>
              <option value="le">LE</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
              Número de Documento
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm"
              value={cardData.cardHolderIdentificationNumber}
              onChange={(e) => handleInputChange('cardHolderIdentificationNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1 block">
            Cuotas / Financiación
          </label>
          <select
            className="w-full px-3 py-2.5 bg-muted/20 border border-border rounded-xl outline-none focus:border-primary text-sm font-bold"
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
          >
            <option value={1}>1 cuota sin interés (${finalPrice.toLocaleString('es-AR')})</option>
            <option value={3}>3 cuotas de ${((finalPrice * 1.15) / 3).toLocaleString('es-AR', {maximumFractionDigits: 2})} (15% recargo)</option>
            <option value={6}>6 cuotas de ${((finalPrice * 1.30) / 6).toLocaleString('es-AR', {maximumFractionDigits: 2})} (30% recargo)</option>
            <option value={12}>12 cuotas de ${((finalPrice * 1.60) / 12).toLocaleString('es-AR', {maximumFractionDigits: 2})} (60% recargo)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
