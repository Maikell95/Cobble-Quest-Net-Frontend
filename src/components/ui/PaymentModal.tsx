import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CURRENCY_SYMBOL } from '../../config/constants';
import type { PaymentItem, PaymentMethod } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/** Max seconds to wait for capture before allowing force-close */
const PROCESSING_TIMEOUT_MS = 20_000;
/** Fetch abort timeout */
const FETCH_TIMEOUT_MS = 30_000;

// ---- Icons ----
function PayPalIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.536 0-.99.393-1.073.928l-.854 5.457-.247 1.57a.57.57 0 0 1-.353.051Z" fill="#253B80"/>
      <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132l-.943 5.974-.266 1.694a.564.564 0 0 0 .555.655h3.903c.578 0 1.069-.42 1.16-.99l.048-.248.918-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.816-.87Z" fill="#179BD7"/>
      <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.176h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.293-.516Z" fill="#222D65"/>
    </svg>
  );
}

// ---- Types ----
export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  username: string;
  items: PaymentItem[];
  totalPrice: number;
  /** Description shown in the modal header (e.g. "Compra de Rango Honor") */
  description?: string;
}

type ModalStep = 'select' | 'processing' | 'success' | 'error';

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  username,
  items,
  totalPrice,
  description,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
  const [step, setStep] = useState<ModalStep>('select');
  const [errorMsg, setErrorMsg] = useState('');
  const [canForceClose, setCanForceClose] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetState = useCallback(() => {
    setStep('select');
    setErrorMsg('');
    setCanForceClose(false);
    // Abort any in-flight fetch
    abortRef.current?.abort();
    abortRef.current = null;
    // Clear processing timer
    if (processingTimerRef.current) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
  }, []);

  // Reset state every time the modal opens (prevents stale state)
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Block scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
    };
  }, []);

  const handleClose = () => {
    if (step === 'processing' && !canForceClose) return;
    resetState();
    onClose();
  };

  const handleSuccessDone = () => {
    resetState();
    onSuccess();
  };

  /** Start the processing timeout — after N seconds allow the user to force-close */
  const startProcessingTimeout = () => {
    setCanForceClose(false);
    if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
    processingTimerRef.current = setTimeout(() => {
      setCanForceClose(true);
    }, PROCESSING_TIMEOUT_MS);
  };

  // ---- PayPal JS SDK handlers ----
  const createPayPalOrder = async (): Promise<string> => {
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          items,
          method: 'paypal',
          inline: true,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al crear la orden.');
      }
      return data.data.orderId;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Inténtalo de nuevo.');
      }
      throw err;
    }
  };

  const capturePayPalOrder = async (orderId: string) => {
    setStep('processing');
    startProcessingTimeout();

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}/api/payments/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, method: 'paypal' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.success && data.data?.status === 'completed') {
        setStep('success');
      } else {
        setErrorMsg(data.message || 'No se pudo completar el pago.');
        setStep('error');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        setErrorMsg('La solicitud tardó demasiado. Verifica tu conexión e inténtalo de nuevo.');
      } else {
        setErrorMsg('Error de conexión al capturar el pago.');
      }
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[480px] bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-theme)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-[var(--text-primary)] text-base font-bold m-0">Pago Seguro</h3>
                  <p className="text-[var(--text-muted)] text-[0.78rem] m-0">
                    {description || 'Completa tu compra'}
                  </p>
                </div>
              </div>
              {(step !== 'processing' || canForceClose) && (
                <button
                  className="w-8 h-8 rounded-lg bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-all"
                  onClick={handleClose}
                  title={step === 'processing' ? 'Cancelar espera' : 'Cerrar'}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {/* ---- Step: select method & pay ---- */}
              {step === 'select' && (
                <>
                  {/* Order summary */}
                  <div className="mb-5 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-[0.82rem]">Jugador</span>
                      <span className="text-[var(--text-primary)] text-[0.88rem] font-semibold">{username}</span>
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[0.82rem] py-1">
                        <span className="text-[var(--text-secondary)]">
                          {item.name} {item.quantity > 1 && `x${item.quantity}`}
                        </span>
                        <span className="text-[var(--text-primary)] font-medium">
                          {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-theme)]">
                      <span className="text-[var(--text-primary)] font-semibold">Total</span>
                      <span className="text-[var(--text-primary)] text-[1.15rem] font-extrabold">
                        {CURRENCY_SYMBOL}{totalPrice.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Method selector */}
                  <div className="mb-5">
                    <span className="text-[var(--text-secondary)] text-[0.82rem] font-medium mb-2 block">
                      Método de pago
                    </span>
                    <div className="flex gap-2">
                      {/* PayPal */}
                      <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-[0.88rem] font-medium cursor-pointer transition-all ${
                          selectedMethod === 'paypal'
                            ? 'border-[#0070ba] bg-[#0070ba]/10 text-[var(--text-primary)]'
                            : 'border-[var(--border-theme)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                        }`}
                        onClick={() => setSelectedMethod('paypal')}
                      >
                        <PayPalIcon size={18} />
                        PayPal
                      </button>

                      {/* Stripe placeholder */}
                      <button
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-theme)] bg-[var(--bg-surface)] text-[var(--text-muted)] text-[0.88rem] font-medium opacity-40 cursor-not-allowed"
                        disabled
                      >
                        <CreditCard size={18} />
                        Stripe
                        <span className="text-[0.65rem] opacity-60 hidden sm:inline">(Pronto)</span>
                      </button>
                    </div>
                  </div>

                  {/* PayPal Buttons */}
                  {selectedMethod === 'paypal' && (
                    <div className="paypal-buttons-wrapper">
                      <PayPalButtons
                        style={{
                          layout: 'vertical',
                          color: 'gold',
                          shape: 'rect',
                          label: 'pay',
                          height: 45,
                        }}
                        createOrder={async () => {
                          try {
                            return await createPayPalOrder();
                          } catch (err) {
                            setErrorMsg(err instanceof Error ? err.message : 'Error al crear la orden.');
                            setStep('error');
                            throw err;
                          }
                        }}
                        onApprove={async (data) => {
                          try {
                            await capturePayPalOrder(data.orderID);
                          } catch (err) {
                            console.error('PayPal onApprove error:', err);
                            setErrorMsg('Error al procesar el pago. Inténtalo de nuevo.');
                            setStep('error');
                          }
                        }}
                        onCancel={() => {
                          // User closed the PayPal popup, just stay on select
                        }}
                        onError={(err) => {
                          console.error('PayPal button error:', err);
                          // Only set error if not already in error/success state
                          if (step === 'select') {
                            setErrorMsg('Error con PayPal. Inténtalo de nuevo.');
                            setStep('error');
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Stripe placeholder message */}
                  {selectedMethod === 'stripe' && (
                    <div className="text-center py-6 text-[var(--text-muted)] text-[0.88rem]">
                      Stripe estará disponible próximamente.
                    </div>
                  )}
                </>
              )}

              {/* ---- Step: processing ---- */}
              {step === 'processing' && (
                <div className="text-center py-10">
                  <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)] text-lg font-medium">Procesando pago...</p>
                  <p className="text-[var(--text-muted)] text-[0.85rem] mt-1">
                    {canForceClose ? 'Está tardando más de lo esperado...' : 'No cierres esta ventana'}
                  </p>
                  {canForceClose && (
                    <button
                      className="mt-4 px-6 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] text-[0.88rem] font-medium cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                      onClick={handleClose}
                    >
                      Cancelar espera
                    </button>
                  )}
                </div>
              )}

              {/* ---- Step: success ---- */}
              {step === 'success' && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <CheckCircle size={56} className="text-[#22c55e] mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-[var(--text-primary)] font-display text-xl mb-2">¡Pago Completado!</h3>
                  <p className="text-[var(--text-muted)] text-[0.88rem] mb-6">
                    Tu compra se ha procesado exitosamente. Los artículos serán entregados a <strong className="text-[var(--text-primary)]">{username}</strong>.
                  </p>
                  <button
                    className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white border-none font-bold text-[0.95rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.4)]"
                    onClick={handleSuccessDone}
                  >
                    Aceptar
                  </button>
                </div>
              )}

              {/* ---- Step: error ---- */}
              {step === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle size={48} className="text-[#ff5252] mx-auto mb-4" />
                  <h3 className="text-[var(--text-primary)] font-display text-xl mb-2">Error en el Pago</h3>
                  <p className="text-[var(--text-muted)] text-[0.88rem] mb-6">{errorMsg}</p>
                  <button
                    className="px-8 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-primary)] font-semibold text-[0.95rem] cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)]"
                    onClick={resetState}
                  >
                    Intentar de Nuevo
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
