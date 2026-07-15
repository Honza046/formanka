'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Clock,
  LogOut,
  Minus,
  Package,
  Phone,
  Plus,
  RefreshCw,
} from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import type { OrderStatus, PizzaOrder } from '@/lib/pizza-orders/types';
import { paymentMethodLabels } from '@/lib/pizza-orders/types';
import { formatPrice } from '@/lib/data';
import { lineItemTotal } from '@/lib/pizza-pricing';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Nová',
  confirmed: 'Peče se',
  ready: 'K vyzvednutí',
  completed: 'Vyzvednuto',
  rejected: 'Zamítnuto',
};

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-gold/15 text-navy ring-1 ring-gold/40',
  confirmed: 'bg-navy/10 text-navy',
  ready: 'bg-gold text-navy',
  completed: 'bg-cream text-navy/60',
  rejected: 'bg-terracotta/10 text-terracotta',
};

function sortOrders(orders: PizzaOrder[]): PizzaOrder[] {
  const priority: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 1,
    ready: 2,
    completed: 3,
    rejected: 4,
  };
  return [...orders].sort((a, b) => {
    const p = priority[a.status] - priority[b.status];
    if (p !== 0) return p;
    return new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime();
  });
}

function playNewOrderSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      gain2.gain.value = 0.15;
      osc2.start();
      osc2.stop(ctx.currentTime + 0.2);
    }, 160);
  } catch {
    /* prohlížeč blokuje zvuk bez interakce */
  }
}

export default function KitchenDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<PizzaOrder[]>([]);
  const [maxPizzas, setMaxPizzas] = useState(40);
  const [remaining, setRemaining] = useState(0);
  const [accepting, setAccepting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [showDone, setShowDone] = useState(false);
  const knownPendingRef = useRef<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const fetchOpts: RequestInit = { credentials: 'same-origin' };
      const [ordersRes, capRes] = await Promise.all([
        fetch('/api/pizza/orders/manage', fetchOpts),
        fetch('/api/pizza/capacity', fetchOpts),
      ]);

      if (ordersRes.status === 401 || capRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!ordersRes.ok || !capRes.ok) return;

      const ordersData = await ordersRes.json();
      const capData = await capRes.json();
      const newOrders: PizzaOrder[] = ordersData.orders ?? [];

      const pendingIds = new Set(
        newOrders.filter((o) => o.status === 'pending').map((o) => o.id),
      );
      if (authenticated && knownPendingRef.current.size > 0) {
        for (const id of pendingIds) {
          if (!knownPendingRef.current.has(id)) {
            playNewOrderSound();
            break;
          }
        }
      }
      knownPendingRef.current = pendingIds;

      setOrders(newOrders);
      setMaxPizzas(capData.capacity?.maxPizzas ?? 40);
      setRemaining(capData.remaining ?? 0);
      setAccepting(capData.capacity?.acceptingOrders ?? true);
      setAuthenticated(true);
    } catch {
      /* ignore */
    }
  }, [authenticated]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await fetch('/api/pizza/kitchen/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ pin: pin.trim() }),
      });
      if (!res.ok) {
        setAuthError('Neplatný PIN');
        return;
      }
      await res.json();

      const check = await fetch('/api/pizza/orders/manage', { credentials: 'same-origin' });
      if (check.status === 401) {
        setAuthError('PIN přijat, ale session nefunguje. Obnovte stránku a zkuste znovu.');
        return;
      }

      setAuthenticated(true);
      await fetchData();
    } catch {
      setAuthError('Připojení selhalo. Zkontrolujte internet a zkuste znovu.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/pizza/kitchen/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setPin('');
    knownPendingRef.current.clear();
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setLoading(true);
    setToast('');
    try {
      const res = await fetch('/api/pizza/orders/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Chyba');
      await fetchData();
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Akce se nezdařila');
    } finally {
      setLoading(false);
    }
  };

  const updateMaxPizzas = async (delta: number) => {
    await fetch('/api/pizza/capacity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxPizzas: Math.max(0, maxPizzas + delta) }),
    });
    await fetchData();
  };

  const toggleAccepting = async () => {
    await fetch('/api/pizza/capacity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acceptingOrders: !accepting }),
    });
    await fetchData();
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border border-navy/5 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col items-center text-center">
              <SiteLogo size="lg" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gold">
                Kuchyně
              </p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-navy">Na Formance</h1>
              <p className="mt-1 text-sm text-navy/55">Žeravice</p>
            </div>
            <form onSubmit={login} className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-4 text-center font-serif text-3xl tracking-[0.3em] text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
              />
              {authError && (
                <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-center text-sm text-terracotta">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || pin.trim().length === 0}
                className="w-full rounded-2xl bg-gold py-4 text-base font-semibold text-navy transition hover:bg-gold-light active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Přihlašuji…' : 'Vstoupit'}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-navy/40">
            Přidejte si stránku na plochu telefonu pro rychlý přístup.
          </p>
        </div>
      </div>
    );
  }

  const activeOrders = sortOrders(
    orders.filter((o) => !['completed', 'rejected'].includes(o.status)),
  );
  const doneOrders = orders.filter((o) => ['completed', 'rejected'].includes(o.status));
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const capacityPct = maxPizzas > 0 ? Math.round((remaining / maxPizzas) * 100) : 0;

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-ivory pb-8">
      <header className="sticky top-0 z-10 border-b border-navy/5 bg-ivory/95 px-4 pb-4 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <SiteLogo size="sm" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                Kuchyně
              </p>
              <h1 className="truncate font-serif text-lg font-bold text-navy">Na Formance</h1>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy transition hover:bg-cream"
              aria-label="Obnovit"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy transition hover:bg-cream"
              aria-label="Odhlásit"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-navy/5 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy/45">
                Kapacita dnes
              </p>
              <p className="mt-1 font-serif text-3xl font-bold text-navy">
                {remaining}
                <span className="text-lg font-normal text-navy/40"> / {maxPizzas}</span>
              </p>
              <p className="mt-0.5 text-xs text-navy/45">pizz zbývá</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateMaxPizzas(-5)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy/10 bg-cream text-navy transition hover:bg-gold/15"
              >
                <Minus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => updateMaxPizzas(5)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy/10 bg-cream text-navy transition hover:bg-gold/15"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${capacityPct}%` }}
            />
          </div>

          <button
            type="button"
            onClick={toggleAccepting}
            className={`mt-4 w-full rounded-2xl py-3 text-sm font-semibold transition active:scale-[0.98] ${
              accepting
                ? 'bg-navy text-ivory hover:bg-navy-light'
                : 'bg-terracotta/15 text-terracotta ring-1 ring-terracotta/30'
            }`}
          >
            {accepting ? 'Přijímáme objednávky' : 'Objednávky pozastaveny'}
          </button>
        </div>

        {pendingCount > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-gold px-4 py-2.5 text-sm font-semibold text-navy shadow-sm">
            <Bell className="h-4 w-4 shrink-0" />
            {pendingCount}{' '}
            {pendingCount === 1 ? 'nová objednávka' : pendingCount < 5 ? 'nové objednávky' : 'nových objednávek'}
          </div>
        )}
      </header>

      {toast && (
        <div className="mx-4 mt-3 rounded-2xl bg-terracotta/10 px-4 py-3 text-center text-sm font-medium text-terracotta ring-1 ring-terracotta/20">
          {toast}
        </div>
      )}

      <section className="px-4 pt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy/45">
          Aktivní objednávky ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy/10 bg-white px-6 py-14 text-center">
            <Package className="mx-auto h-10 w-10 text-navy/20" />
            <p className="mt-3 text-sm text-navy/45">Žádné aktivní objednávky</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {activeOrders.map((order) => (
              <li
                key={order.id}
                className={`rounded-3xl border bg-white p-4 shadow-sm ${
                  order.status === 'pending'
                    ? 'border-gold/50 ring-2 ring-gold/25'
                    : 'border-navy/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <p className="mt-2 font-serif text-xl font-bold text-navy">#{order.id}</p>
                    <p className="font-semibold text-navy">{order.customerName}</p>
                    <p className="mt-0.5 text-xs text-navy/50">
                      {paymentMethodLabels[order.paymentMethod ?? 'on_site']}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-cream px-3 py-2 text-navy">
                    <Clock className="h-4 w-4 text-gold" />
                    <span className="text-lg font-bold tabular-nums">
                      {new Date(order.pickupTime).toLocaleTimeString('cs-CZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 space-y-2 border-t border-navy/5 pt-3">
                  {order.items.map((item, index) => (
                    <li key={`${item.pizzaName}-${index}`} className="text-sm">
                      <span className="font-medium text-navy">
                        {item.quantity}× {item.pizzaName}
                      </span>
                      {item.extras && item.extras.length > 0 && (
                        <p className="mt-0.5 text-xs font-medium text-gold">+ {item.extras.join(', ')}</p>
                      )}
                      {item.customization?.trim() && (
                        <p className="mt-0.5 text-xs italic text-navy/55">{item.customization}</p>
                      )}
                      <p className="mt-0.5 text-xs text-navy/45">
                        {formatPrice(lineItemTotal(item.pizzaName, item.quantity, item.extras ?? []))}
                      </p>
                    </li>
                  ))}
                </ul>

                {order.note && (
                  <p className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-sm text-navy ring-1 ring-gold/20">
                    {order.note}
                  </p>
                )}

                <div className="mt-4 grid gap-2">
                  <a
                    href={`tel:${order.phone.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-navy/10 bg-cream py-3 text-sm font-medium text-navy transition hover:bg-gold/10"
                  >
                    <Phone className="h-4 w-4" />
                    {order.phone}
                  </a>

                  {order.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateStatus(order.id, 'confirmed')}
                        className="rounded-2xl bg-navy py-3.5 text-sm font-semibold text-ivory transition active:scale-[0.98] disabled:opacity-50"
                      >
                        Potvrdit
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateStatus(order.id, 'rejected')}
                        className="rounded-2xl border border-terracotta/30 bg-terracotta/5 py-3.5 text-sm font-semibold text-terracotta transition active:scale-[0.98] disabled:opacity-50"
                      >
                        Zamítnout
                      </button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-semibold text-navy transition active:scale-[0.98] disabled:opacity-50"
                    >
                      <Package className="h-4 w-4" />
                      Hotovo — k vyzvednutí
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="rounded-2xl border border-navy/15 bg-white py-3.5 text-sm font-semibold text-navy ring-1 ring-navy/10 transition active:scale-[0.98] disabled:opacity-50"
                    >
                      Vyzvednuto
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {doneOrders.length > 0 && (
        <section className="mt-6 px-4">
          <button
            type="button"
            onClick={() => setShowDone(!showDone)}
            className="mb-3 text-sm font-semibold text-navy/45"
          >
            {showDone ? 'Skrýt' : 'Zobrazit'} hotové ({doneOrders.length})
          </button>
          {showDone && (
            <ul className="space-y-2">
              {doneOrders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl border border-navy/5 bg-white/80 px-4 py-3 text-sm text-navy/60"
                >
                  <span className="font-medium text-navy/80">#{order.id}</span> — {order.customerName}{' '}
                  · {statusLabels[order.status]}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
