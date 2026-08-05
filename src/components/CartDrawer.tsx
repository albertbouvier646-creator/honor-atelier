import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { formatEur } from "@/lib/catalog";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalEur, itemCount, isCartOpen, setIsCartOpen } =
    useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
      toast.success("Commande validée avec succès !", {
        description: "Un email de confirmation et vos liens de téléchargement vous ont été envoyés.",
        duration: 6000,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface text-ink shadow-2xl flex flex-col justify-between border-l border-ink/10">
          {/* Header */}
          <div className="p-6 border-b border-ink/10 flex items-center justify-between bg-canvas">
            <div className="flex items-center gap-3">
              <ShoppingBag className="size-5 text-accent" />
              <h2 className="font-serif text-2xl font-light">Mon Panier HONOR</h2>
              <span className="text-xs font-mono bg-accent/15 text-accent px-2 py-0.5 rounded-full font-bold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-ink/50 hover:text-ink transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderComplete ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="size-12 text-accent mx-auto" />
                <h3 className="font-serif text-2xl">Merci pour votre commande !</h3>
                <p className="text-xs text-ink/70 leading-relaxed max-w-xs mx-auto">
                  Votre commande a bien été enregistrée par l'Atelier. Vos accès numériques et confirmations d'atelier sont envoyés à votre adresse e-mail.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-4 px-6 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em]"
                >
                  Poursuivre la navigation
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <ShoppingBag className="size-12 text-ink/20 mx-auto" />
                <p className="font-serif text-xl text-ink/60">Votre panier est vide pour le moment</p>
                <p className="text-xs text-ink/50 max-w-xs mx-auto">
                  Découvrez nos formations d'atelier, nos patrons de couture et nos ebooks pas-à-pas.
                </p>
                <Link
                  to="/cours"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-6 py-3 bg-ink text-canvas text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors mt-2"
                >
                  Découvrir le catalogue
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-canvas border border-ink/10 rounded-sm relative group"
                  >
                    <img
                      src={item.image}
                      alt={item.titre}
                      className="size-20 object-cover rounded-sm border border-ink/10 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-lg leading-tight text-ink">{item.titre}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-ink/40 hover:text-destructive transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        {item.options && (
                          <span className="text-[10px] uppercase tracking-wider text-accent font-medium block mt-1">
                            {item.options}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-ink/5">
                        <div className="flex items-center gap-2 border border-ink/15 bg-surface rounded-sm px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-ink/60 hover:text-ink p-0.5"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-xs font-mono font-semibold px-1">{item.quantite}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-ink/60 hover:text-ink p-0.5"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <span className="font-serif text-lg font-light text-ink">
                          {formatEur(item.prixEur * item.quantite)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-ink/10 bg-canvas space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-ink/60">
                  <span>Sous-total articles</span>
                  <span>{formatEur(totalEur)}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Livraison / Accès numérique</span>
                  <span className="text-accent font-semibold">Gratuit (Instant PDF / Atelier)</span>
                </div>
                <div className="flex justify-between text-base font-serif text-ink pt-2 border-t border-ink/10 font-medium">
                  <span>Total TTC</span>
                  <span className="text-2xl font-light text-ink">{formatEur(totalEur)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-ink text-canvas text-[11px] uppercase tracking-[0.2em] hover:bg-accent transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <span>Traitement sécurisé...</span>
                  ) : (
                    <>
                      <Lock className="size-3.5" /> Passer la commande • {formatEur(totalEur)}
                    </>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-center text-ink/50 uppercase tracking-widest flex items-center justify-center gap-1">
                <Lock className="size-3" /> Paiement 100% sécurisé & Accès immédiat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
