'use client';

import { Loader2, ArrowRight } from 'lucide-react';

interface AppliedCoupon {
  codigo: string;
  descuento_porcentual?: number;
  descuento_fijo?: number;
}

interface CartSummaryProps {
  paymentMethod: 'mercadopago' | 'payway';
  setPaymentMethod: (method: 'mercadopago' | 'payway') => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: AppliedCoupon | null;
  couponError: string | null;
  isApplyingCoupon: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  totalPrice: number;
  discountAmount: number;
  shippingCost: number;
  isCalculatingShipping: boolean;
  installments: number;
  isProcessing: boolean;
  onCheckout: () => void;
  showShippingForm: boolean;
}

export function CartSummary({
  paymentMethod,
  setPaymentMethod,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponError,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  totalPrice,
  discountAmount,
  shippingCost,
  isCalculatingShipping,
  installments,
  isProcessing,
  onCheckout,
  showShippingForm
}: CartSummaryProps) {
  const finalPrice = Math.max(0, totalPrice - discountAmount);
  
  let recargoMult = 1;
  if (paymentMethod === 'payway') {
    if (installments === 3) recargoMult = 1.15;
    else if (installments === 6) recargoMult = 1.30;
    else if (installments === 12) recargoMult = 1.60;
  }
  const totalConRecargo = (finalPrice + shippingCost) * recargoMult;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Selección de Método de Pago */}
      <div>
        <h2 className="text-xl font-bold border-b border-border/50 pb-4 mb-4">Método de Pago</h2>
        
        <div className="space-y-3">
          <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all hover:border-primary/50 ${
            paymentMethod === 'mercadopago' 
              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
              : 'border-border bg-card'
          }`}>
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="mercadopago" 
                checked={paymentMethod === 'mercadopago'} 
                onChange={() => setPaymentMethod('mercadopago')}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="font-bold text-foreground">Mercado Pago</span>
            </div>
            <img 
              src="/images/logos/mercadopago.png" 
              alt="Mercado Pago" 
              className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-normal" 
            />
          </label>
          
          <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all hover:border-primary/50 ${
            paymentMethod === 'payway' 
              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
              : 'border-border bg-card'
          }`}>
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="payway" 
                checked={paymentMethod === 'payway'} 
                onChange={() => setPaymentMethod('payway')}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="font-bold text-foreground">Tarjeta (Payway)</span>
            </div>
            <img 
              src="/images/logos/payway.png" 
              alt="Payway" 
              className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-normal" 
            />
          </label>
        </div>
      </div>

      {/* Cupones de Descuento */}
      <div className="border-t border-border/50 pt-6">
        <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
          Cupón de Descuento
        </h3>
        
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
            <div>
              <p className="text-xs font-bold text-green-600">Cupón Aplicado</p>
              <p className="text-sm font-extrabold text-green-700">{appliedCoupon.codigo}</p>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs font-bold text-destructive hover:underline cursor-pointer"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CÓDIGO"
                className="flex-1 px-4 py-2.5 bg-muted/20 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary uppercase"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                onClick={onApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="bg-primary text-primary-foreground text-xs font-bold px-4 rounded-xl hover:bg-primary/95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[80px]"
              >
                {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
              </button>
            </div>
            {couponError && (
              <p className="text-xs font-bold text-destructive">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* Desglose Financiero */}
      <div className="border-t border-border/50 pt-6 space-y-3">
        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
          Resumen
        </h3>
        
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Subtotal:</span>
          <span className="font-bold text-foreground">${totalPrice.toLocaleString('es-AR')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Descuento:</span>
            <span className="font-bold">-${discountAmount.toLocaleString('es-AR')}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Envío:</span>
          {isCalculatingShipping ? (
            <span className="text-foreground/40 flex items-center text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-primary" />
              Calculando...
            </span>
          ) : (
            <span className="font-bold text-foreground">
              {shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : 'Gratis'}
            </span>
          )}
        </div>

        {paymentMethod === 'payway' && installments > 1 && (
          <div className="flex justify-between text-sm text-primary">
            <span>Recargo financiación ({installments === 3 ? '15%' : installments === 6 ? '30%' : '60%'}):</span>
            <span className="font-bold">
              +${((finalPrice + shippingCost) * (recargoMult - 1)).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        )}

        <div className="flex justify-between items-end border-t border-border/50 pt-4 mt-2">
          <span className="font-black text-foreground text-base">Total a pagar:</span>
          <div className="text-right">
            <span className="font-black text-2xl text-primary block leading-none">
              ${totalConRecargo.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            {paymentMethod === 'payway' && installments > 1 && (
              <span className="text-[10px] font-bold text-foreground/40 mt-1 block">
                {installments} cuotas de ${(totalConRecargo / installments).toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón de Checkout */}
      <button
        onClick={onCheckout}
        disabled={isProcessing}
        className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer text-base uppercase tracking-wider"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-1" />
            Procesando Pago...
          </>
        ) : (
          <>
            {showShippingForm ? 'Confirmar y Pagar' : 'Iniciar Compra'}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
