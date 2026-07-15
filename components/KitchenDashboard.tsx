'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  ChefHat,
  Clock,
  LogOut,
  Minus,
  Package,
  Phone,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import type { OrderStatus, PizzaOrder } from '@/lib/pizza-orders/types';
import { paymentMethodLabels, pizzaCount } from '@/lib/pizza-orders/types';
import { formatPrice } from '@/lib/data';
import { lineItemTotal } from '@/lib/pizza-pricing';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Nová',
  confirmed: 'Peče se',
  ready: 'K vyzvednutí',
  completed: 'Vyzvednuto',
  rejected: 'Zamítnuto',
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
      const [ordersRes, capRes] = await Promise.all([
        fetch('/api/pizza/orders/manage'),
        fetch('/api/pizza/capacity'),
      ]);

      if (ordersRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!ordersRes.ok || !capRes.ok) return;

      const ordersData = await ordersRes.json();
      const capData = await capRes.json();
      const newOrders: PizzaOrder[] = ordersData.orders ?? [];

      // Zvuk při nové objednávce
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
    const res = await fetch('/api/pizza/kitchen/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      setAuthError('Neplatný PIN');
      return;
    }
    setAuthenticated(true);
    fetchData();
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
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <ChefHat className="mx-auto h-14 w-14 text-forest" />
            <h1 className="mt-4 font-serif text-2xl font-bold text-slate-deep">Kuchyně</h1>
            <p className="mt-1 text-sm text-slate-deep/60">Na Formance — Žeravice</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-deep/10 bg-ivory px-4 py-4 text-center text-3xl tracking-[0.3em] outline-none focus:border-forest"
            />
            {authError && <p className="text-center text-sm text-red-600">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-forest py-4 text-base font-bold text-ivory active:scale-[0.98]"
            >
              Vstoupit
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeOrders = sortOrders(
    orders.filter((o) => !['completed', 'rejected'].includes(o.status)),
  );
  const doneOrders = orders.filter((o) => ['completed', 'rejected'].includes(o.status));
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-deep px-4 pb-4 pt-6 text-ivory">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/50">Kuchyně</p>
            <h1 className="font-serif text-xl font-bold">Na Formance</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"
              aria-label="Obnovit"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"
              aria-label="Odhlásit"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Kapacita */}
        <div className="mt-4 rounded-2xl bg-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ivory/60">Zbývá dnes</p>
              <p className="text-3xl font-bold">
                {remaining}
                <span className="text-base font-normal text-ivory/50"> / {maxPizzas}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateMaxPizzas(-5)}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold"
              >
                <Minus className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => updateMaxPizzas(5)}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-bold"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleAccepting}
            className={`mt-3 w-full rounded-xl py-3 text-sm font-bold ${
              accepting ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {accepting ? '✓ Přijímáme objednávky' : '✕ Objednávky pozastaveny'}
          </button>
        </div>

        {pendingCount > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white">
            <Bell className="h-4 w-4" />
            {pendingCount} {pendingCount === 1 ? 'nová objednávka' : 'nové objednávky'}
          </div>
        )}
      </header>

      {toast && (
        <div className="mx-4 mt-3 rounded-xl bg-red-500 px-4 py-3 text-center text-sm font-medium text-white">
          {toast}
        </div>
      )}

      {/* Aktivní objednávky */}
      <section className="px-4 pt-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ivory/50">
          Aktivní ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-ivory/40">
            Žádné aktivní objednávky
          </p>
        ) : (
          <ul className="space-y-3">
            {activeOrders.map((order) => (
              <li
                key={order.id}
                className={`rounded-2xl bg-white p-4 shadow-lg ${
                  order.status === 'pending' ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <p className="mt-1 font-serif text-xl font-bold text-slate-deep">
                      #{order.id}
                    </p>
                    <p className="font-semibold text-slate-deep">{order.customerName}</p>
                    <p className="mt-1 text-xs font-medium text-slate-deep/60">
                      {paymentMethodLabels[order.paymentMethod ?? 'on_site']}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-forest/10 px-3 py-2 text-forest">
                    <Clock className="h-4 w-4" />
                    <span className="text-lg font-bold">
                      {new Date(order.pickupTime).toLocaleTimeString('cs-CZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 space-y-2 border-t border-slate-deep/5 pt-3">
                  {order.items.map((item, index) => (
                    <li key={`${item.pizzaName}-${index}`} className="text-sm">
                      <span className="font-medium text-slate-deep">
                        {item.quantity}× {item.pizzaName}
                      </span>
                      {item.extras && item.extras.length > 0 && (
                        <p className="mt-0.5 text-xs font-medium text-forest">
                          + {item.extras.join(', ')}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-slate-deep/60">
                        {formatPrice(lineItemTotal(item.pizzaName, item.quantity, item.extras ?? []))}
                      </p>
                    </li>
                  ))}
                </ul>

                {order.note && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    ⚠ {order.note}
                  </p>
                )}

                <div className="mt-4 grid gap-2">
                  <a
                    href={`tel:${order.phone.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-deep/10 py-3 text-sm font-medium text-slate-deep"
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
                        className="rounded-xl bg-forest py-4 text-sm font-bold text-ivory active:scale-[0.98] disabled:opacity-50"
                      >
                        ✓ Potvrdit
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => updateStatus(order.id, 'rejected')}
                        className="rounded-xl border-2 border-red-200 py-4 text-sm font-bold text-red-600 active:scale-[0.98] disabled:opacity-50"
                      >
                        ✕ Zamítnout
                      </button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="rounded-xl bg-green-600 py-4 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-50"
                    >
                      <Package className="mr-1 inline h-4 w-4" />
                      Hotovo — k vyzvednutí
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="rounded-xl bg-slate-deep py-4 text-sm font-bold text-ivory active:scale-[0.98] disabled:opacity-50"
                    >
                      ✓ Vyzvednuto
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Hotové */}
      {doneOrders.length > 0 && (
        <section className="mt-6 px-4">
          <button
            type="button"
            onClick={() => setShowDone(!showDone)}
            className="mb-3 text-sm font-semibold text-ivory/50"
          >
            {showDone ? '▼' : '▶'} Hotové / zamítnuté ({doneOrders.length})
          </button>
          {showDone && (
            <ul className="space-y-2 opacity-60">
              {doneOrders.map((order) => (
                <li key={order.id} className="rounded-xl bg-white/10 px-4 py-3 text-sm text-ivory">
                  #{order.id} — {order.customerName} — {statusLabels[order.status]}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
