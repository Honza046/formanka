'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, CreditCard, Minus, Plus, ShoppingBag, Wallet } from 'lucide-react';
import { pizzaExtras, pizzaMenu, formatPrice, pizzaBoxPrice } from '@/lib/data';
import { lineItemTotal, orderItemsTotal } from '@/lib/pizza-pricing';
import type { OrderItem, PaymentMethod } from '@/lib/pizza-orders/types';
import { getPickupSlots } from '@/lib/pizza-orders/pickup-slots';

type CartLine = OrderItem & { id: string; expanded?: boolean };

type PickupSlot = { value: string; label: string };

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
}

function PickupTimePicker({
  slots,
  value,
  onChange,
}: {
  slots: PickupSlot[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const selected = slots.find((s) => s.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id="order-pickup"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-ivory px-4 py-2.5 text-sm outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20 ${
          open ? 'border-forest ring-2 ring-forest/20' : 'border-slate-deep/10'
        }`}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-forest/60" />
          <span className={selected ? 'font-medium text-slate-deep' : 'text-slate-deep/50'}>
            {selected ? formatSlotTime(selected.value) : 'Vyberte čas vyzvednutí'}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-deep/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="order-pickup"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-deep/10 bg-white py-1 shadow-lg"
        >
          {slots.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-deep/50">Dnes už není k dispozici žádný termín</li>
          ) : (
            slots.map((slot) => {
              const isSelected = slot.value === value;
              return (
                <li key={slot.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(slot.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? 'bg-forest/10 font-semibold text-forest'
                        : 'text-slate-deep hover:bg-ivory'
                    }`}
                  >
                    <span>{formatSlotTime(slot.value)}</span>
                    {isSelected && <span className="text-xs">✓</span>}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

function newLineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function newCartLine(pizzaName: string): CartLine {
  return {
    id: newLineId(),
    pizzaName,
    quantity: 1,
    extras: [],
    expanded: true,
  };
}

export default function PizzaOrderForm() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('on_site');
  const [note, setNote] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [accepting, setAccepting] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ id: string; pickupTime: string; phone: string } | null>(null);
  const [slots, setSlots] = useState(() => getPickupSlots());
  const cartRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setSlots(getPickupSlots());
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/pizza/orders')
      .then((r) => r.json())
      .then((data) => {
        setRemaining(data.remaining);
        setAccepting(data.acceptingOrders);
        setOrdersOpen(data.ordersOpen ?? true);
      })
      .catch(() => {});
  }, [success]);

  const addToCart = (pizzaName: string) => {
    setCart((prev) => [...prev, newCartLine(pizzaName)]);
    requestAnimationFrame(() => {
      cartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const updateLine = (id: string, updates: Partial<CartLine>) => {
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, ...updates } : line)));
  };

  const toggleExtra = (id: string, extra: string) => {
    setCart((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;
        const extras = line.extras ?? [];
        const has = extras.includes(extra);
        return {
          ...line,
          extras: has ? extras.filter((e) => e !== extra) : [...extras, extra],
        };
      }),
    );
  };

  const adjustQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + delta } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeLine = (id: string) => {
    setCart((prev) => prev.filter((line) => line.id !== id));
  };

  // Funkce pro validaci a nastavení telefonního čísla na max 9 číslic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Odstraní vše kromě číslic
    if (value.length <= 9) {
      setPhone(value);
    }
  };

  const totalPizzas = cart.reduce((s, i) => s + i.quantity, 0);
  const orderTotal = orderItemsTotal(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pickupTime) {
      setError('Vyberte prosím čas vyzvednutí.');
      return;
    }

    setLoading(true);

    const items: OrderItem[] = cart.map(({ id: _id, expanded: _expanded, ...item }) => ({
      ...item,
      extras: item.extras?.length ? item.extras : undefined,
    }));

    try {
      const res = await fetch('/api/pizza/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          pickupTime,
          items,
          note: note || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess({
        id: data.order.id,
        pickupTime: data.order.pickupTime,
        phone,
      });
      sessionStorage.setItem(`formanka-order-phone:${data.order.id}`, phone);
      setCart([]);
      setName('');
      setPhone('');
      setPickupTime('');
      setPaymentMethod('on_site');
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při odesílání.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-forest/20 bg-forest/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest" />
        <h3 className="mt-4 font-serif text-2xl font-bold text-slate-deep">Objednávka odeslána!</h3>
        <p className="mt-2 text-sm text-slate-deep/70">
          Číslo objednávky: <strong>{success.id}</strong>
        </p>
        <p className="mt-1 text-sm text-slate-deep/70">
          Vyzvednutí:{' '}
          <strong>
            {new Date(success.pickupTime).toLocaleString('cs-CZ', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </p>
        <p className="mt-4 text-sm text-slate-deep/60">
          Počkejte prosím na potvrzení z kuchyně. Stav objednávky uvidíte níže.
        </p>
        <Link
          href={`/pizza/objednavka/${success.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto"
        >
          Sledovat stav objednávky
        </Link>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-4 block w-full text-sm font-semibold text-forest hover:underline sm:mx-auto sm:w-auto"
        >
          Nová objednávka
        </button>
      </div>
    );
  }

  if (!ordersOpen) {
    return (
      <div className="rounded-3xl border border-slate-deep/10 bg-white p-8 text-center">
        <p className="font-medium text-slate-deep">Online objednávky jsou dostupné pátek až neděli.</p>
        <p className="mt-2 text-sm text-slate-deep/60">
          Mimo víkend nás kontaktujte telefonicky.
        </p>
      </div>
    );
  }

  if (!accepting) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/5 p-8 text-center">
        <p className="font-medium text-slate-deep">Objednávky jsou pro dnešek uzavřeny.</p>
        <p className="mt-2 text-sm text-slate-deep/60">Kapacita kuchyně je naplněna. Zkuste to zítra.</p>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} className={`space-y-8 ${cart.length > 0 ? 'pb-28' : ''}`}>
      {remaining !== null && (
        <div className="rounded-2xl bg-forest/10 px-4 py-3 text-center text-sm text-forest">
          Dnes zbývá přibližně <strong>{remaining}</strong> pizz k objednání
        </div>
      )}

      <div>
        <h3 className="mb-4 font-serif text-xl font-bold text-slate-deep">Vyberte pizzy</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pizzaMenu.map((pizza) => {
            const count = cart.filter((line) => line.pizzaName === pizza.name).length;
            return (
              <li
                key={pizza.name}
                className="flex flex-col gap-3 rounded-2xl border border-slate-deep/5 bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-deep">{pizza.name}</p>
                  {pizza.description && (
                    <p className="text-xs text-slate-deep/50">{pizza.description}</p>
                  )}
                  <p className="mt-1 text-sm font-semibold text-forest">{formatPrice(pizza.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(pizza.name)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-forest/10 px-3 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-ivory"
                >
                  <Plus className="h-4 w-4" />
                  Přidat
                  {count > 0 && (
                    <span className="ml-0.5 rounded-full bg-forest px-1.5 py-0.5 text-xs text-ivory">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {cart.length > 0 && (
        <div ref={cartRef}>
          <h3 className="mb-4 font-serif text-xl font-bold text-slate-deep">Vaše pizzy</h3>
          <ul className="space-y-3">
            {cart.map((line) => (
              <li
                key={line.id}
                className="rounded-2xl border border-slate-deep/5 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-deep">{line.pizzaName}</p>
                    {(line.extras?.length ?? 0) > 0 && (
                      <p className="mt-0.5 text-xs text-forest">
                        + {line.extras!.join(', ')}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-slate-deep">
                      {formatPrice(lineItemTotal(line.pizzaName, line.quantity, line.extras ?? []))}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustQty(line.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-deep/10"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => adjustQty(line.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-ivory"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateLine(line.id, { expanded: !line.expanded })}
                  className="mt-3 flex w-full items-center justify-between rounded-xl bg-ivory px-3 py-2 text-sm font-medium text-forest"
                >
                  Upravit pizzu
                  {line.expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {line.expanded && (
                  <div className="mt-3 space-y-3 border-t border-slate-deep/5 pt-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-deep/50">
                        Přidat navíc
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pizzaExtras.map((extra) => {
                          const selected = line.extras?.includes(extra.name) ?? false;
                          return (
                            <button
                              key={extra.name}
                              type="button"
                              onClick={() => toggleExtra(line.id, extra.name)}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                selected
                                  ? 'bg-forest text-ivory'
                                  : 'bg-slate-deep/5 text-slate-deep hover:bg-slate-deep/10'
                              }`}
                            >
                              {selected ? '✓ ' : '+ '}
                              {extra.name} {formatPrice(extra.price)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="text-xs font-medium text-terracotta hover:underline"
                    >
                      Odebrat z objednávky
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {totalPizzas > 0 && (
        <>
          <div ref={checkoutRef} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order-name" className="mb-1.5 block text-sm font-medium">
                Jméno <span className="text-terracotta">*</span>
              </label>
              <input
                id="order-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              />
            </div>
            <div>
              <label htmlFor="order-phone" className="mb-1.5 block text-sm font-medium">
                Telefon <span className="text-terracotta">*</span>
              </label>
              <input
                id="order-phone"
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="774173331"
                maxLength={9}
                className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="order-pickup" className="mb-1.5 block text-sm font-medium">
              Kdy si přijdete pro pizzu? <span className="text-terracotta">*</span>
            </label>
            <PickupTimePicker
              slots={slots}
              value={pickupTime}
              onChange={setPickupTime}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              Platba <span className="text-terracotta">*</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('on_site')}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  paymentMethod === 'on_site'
                    ? 'border-forest bg-forest/5 ring-2 ring-forest/20'
                    : 'border-slate-deep/10 bg-white hover:border-slate-deep/20'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <Wallet className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-deep">Na místě</span>
                  <span className="mt-0.5 block text-xs text-slate-deep/60">
                    Hotově nebo kartou při vyzvednutí
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  paymentMethod === 'online'
                    ? 'border-forest bg-forest/5 ring-2 ring-forest/20'
                    : 'border-slate-deep/10 bg-white hover:border-slate-deep/20'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <CreditCard className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-deep">Online kartou</span>
                  <span className="mt-0.5 block text-xs text-slate-deep/60">
                    Zaplatíte kartou před vyzvednutím
                  </span>
                </span>
              </button>
            </div>
            {paymentMethod === 'online' && (
              <p className="mt-2 text-xs text-slate-deep/50">
                Online platba zatím funguje jako rezervace — kartou zaplatíte po napojení platební
                brány (GoPay / Stripe). Poplatek brány je obvykle cca 1–2&nbsp;% z částky.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="order-note" className="mb-1.5 block text-sm font-medium">
              Poznámka k celé objednávce
            </label>
            <textarea
              id="order-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Alergie, doručení k autu…"
              className="w-full resize-y rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none focus:border-forest"
            />
          </div>

          {error && <p className="text-sm text-terracotta">{error}</p>}

          <div className="rounded-2xl border border-slate-deep/5 bg-white px-5 py-4">
            <div className="flex justify-between text-sm text-slate-deep/70">
              <span>Pizzy včetně přísad</span>
              <span>{formatPrice(orderTotal - totalPizzas * pizzaBoxPrice)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-slate-deep/70">
              <span>Krabice ({totalPizzas}×)</span>
              <span>{formatPrice(totalPizzas * pizzaBoxPrice)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-deep/5 pt-3 font-serif text-lg font-bold text-slate-deep">
              <span>Celkem</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || totalPizzas === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light disabled:opacity-50 sm:w-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            {loading ? 'Odesílám…' : `Objednat ${totalPizzas} ${totalPizzas === 1 ? 'pizzu' : totalPizzas < 5 ? 'pizzy' : 'pizz'}`}
          </button>
        </>
      )}
    </form>

    {cart.length > 0 && (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-deep/10 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(40,48,64,0.1)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="font-serif font-bold text-slate-deep">
              {totalPizzas}{' '}
              {totalPizzas === 1 ? 'pizza' : totalPizzas < 5 ? 'pizzy' : 'pizz'} v košíku
            </p>
            <p className="text-sm text-slate-deep/60">Celkem {formatPrice(orderTotal)}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
          >
            <ShoppingBag className="h-4 w-4" />
            Pokračovat
          </button>
        </div>
      </div>
    )}
    </>
  );
}