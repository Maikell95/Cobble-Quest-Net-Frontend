import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { usePlayer } from '../../context/usePlayer';
import { CURRENCY_SYMBOL } from '../../config/constants';
import PaymentModal from '../../components/ui/PaymentModal';
import type { PaymentItem } from '../../types';

export default function Cart() {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { requireWhitelistedPlayer, player } = usePlayer();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleCheckout = async () => {
    if (!(await requireWhitelistedPlayer()) || !player) return;
    if (items.length === 0) return;
    setPaymentOpen(true);
  };

  const paymentItems: PaymentItem[] = items.map((ci) => ({
    name: ci.item.name,
    price: ci.item.price,
    quantity: ci.quantity,
    commands: 'commands' in ci.item ? ci.item.commands : undefined,
    storeItemId: 'id' in ci.item ? String(ci.item.id) : undefined,
  }));

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-8 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[2rem]">Carrito</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">Revisa tus artículos antes de comprar</p>
          </motion.div>
        </div>
      </section>

      <div className="section-container py-8 pb-16">
        {items.length === 0 ? (
          <div className="text-center py-24 px-8 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-[20px] text-[var(--text-muted)]">
            <ShoppingCart size={64} className="text-[var(--text-muted)] mb-6 mx-auto" />
            <h2 className="text-[var(--text-secondary)] font-display text-[1.5rem] mb-3">Tu carrito está vacío</h2>
            <p className="mb-8">Explora nuestra tienda y encuentra artículos increíbles para tu aventura.</p>
            <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white no-underline font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.4)]">
              <ArrowLeft size={18} />
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_340px] gap-8 items-start max-md:grid-cols-1">
            <div className="flex flex-col gap-3">
              {items.map((cartItem, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-5 px-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl max-sm:flex-wrap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-1">
                    <h3 className="text-[var(--text-primary)] text-base font-semibold">{'name' in cartItem.item ? cartItem.item.name : 'Item'}</h3>
                    <p className="text-[var(--text-muted)] text-[0.82rem] capitalize">{cartItem.type}</p>
                  </div>
                  <div className="text-[var(--text-secondary)] text-[0.9rem] font-medium">x{cartItem.quantity}</div>
                  <div className="text-[var(--text-primary)] text-base font-bold min-w-[80px] text-right">
                    {CURRENCY_SYMBOL}
                    {'price' in cartItem.item
                      ? (cartItem.item.price * cartItem.quantity).toFixed(2)
                      : '0.00'}
                  </div>
                  <button
                    className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer p-2 rounded-lg transition-all hover:text-[#ff5252] hover:bg-[rgba(255,82,82,0.1)]"
                    onClick={() => 'id' in cartItem.item && removeItem(cartItem.item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl sticky top-[90px] max-md:static">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-theme)]">
                <span className="text-[var(--text-secondary)] text-base">Total</span>
                <span className="text-[var(--text-primary)] text-[1.5rem] font-extrabold">
                  {CURRENCY_SYMBOL}
                  {totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white border-none font-bold text-base cursor-pointer transition-all duration-300 mb-3 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </button>

              <button
                className="w-full py-2.5 rounded-[10px] bg-transparent border border-[rgba(255,82,82,0.2)] text-[#ff5252] text-[0.88rem] cursor-pointer transition-all hover:bg-[rgba(255,82,82,0.08)]"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {player && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={() => {
            setPaymentOpen(false);
            clearCart();
          }}
          username={player.username}
          items={paymentItems}
          totalPrice={totalPrice}
          description={`${items.length} artículo${items.length > 1 ? 's' : ''} en tu carrito`}
        />
      )}
    </div>
  );
}
