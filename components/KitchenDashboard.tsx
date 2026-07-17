'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Clock,
  Globe,
  LogOut,
  Minus,
  Package,
  Phone,
  Pizza,
  Plus,
  RefreshCw,
} from 'lucide-react';
import OpeningStatusPill from '@/components/OpeningStatusPill';
import SiteLogo from '@/components/SiteLogo';
import type {
  OpeningStatusMode,
  OpeningStatusSettings,
  OrderStatus,
  PizzaOrder,
  SiteAnnouncementSettings,
} from '@/lib/pizza-orders/types';
import { paymentMethodLabels } from '@/lib/pizza-orders/types';
import { formatPrice } from '@/lib/data';
import { getOpeningStatus } from '@/lib/opening-status';
import { lineItemTotal } from '@/lib/pizza-pricing';

const openingModeLabels: Record<OpeningStatusMode, string> = {
  auto: 'Podle otevírací doby',
  open: 'Vynutit otevřeno',
  closed: 'Vynutit zavřeno',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Nová',
  confirmed: 'Peče se',
  ready: 'K vyzvednutí',
  completed: 'Vyzvednuto',
  rejected: 'Zamítnuto',
};

type KitchenTab = 'orders' | 'pizza' | 'web';

const kitchenTabs: { id: KitchenTab; label: string; icon: typeof Package }[] = [
  { id: 'orders', label: 'Objednávky', icon: Package },
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'web', label: 'Web', icon: Globe },
];

function KitchenAccordion({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-navy/5 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-cream/60"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">{title}</p>
          {subtitle ? <p className="mt-0.5 truncate text-xs text-navy/50">{subtitle}</p> : null}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-navy/45 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? <div className="border-t border-navy/5 px-4 pb-4 pt-3">{children}</div> : null}
    </div>
  );
}

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
  const [openingStatus, setOpeningStatus] = useState<OpeningStatusSettings>({
    mode: 'auto',
    openLabel: 'Nyní máme otevřeno',
    closedLabel: 'Nyní máme zavřeno',
    opensTodayLabel: 'Otevíráme v',
    opensAnotherDayLabel: 'Otevíráme',
    untilLabel: 'do',
  });
  const [siteAnnouncement, setSiteAnnouncement] = useState<SiteAnnouncementSettings>({
    enabled: false,
    message: '',
    href: '',
    linkLabel: '',
    variant: 'warning',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [activeTab, setActiveTab] = useState<KitchenTab>('orders');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'pizza-capacity': true,
    'web-banner': true,
    'web-pill': false,
  });
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
      setOpeningStatus((prev) => ({ ...prev, ...(capData.openingStatus ?? {}) }));
      setSiteAnnouncement((prev) => ({ ...prev, ...(capData.siteAnnouncement ?? {}) }));
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

  const saveOpeningStatus = async () => {
    setLoading(true);
    setToast('');
    try {
      const res = await fetch('/api/pizza/capacity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Uložení se nezdařilo');
      setOpeningStatus((prev) => ({ ...prev, ...(data.openingStatus ?? {}) }));
      setToast('Stavová pilulka uložena');
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Uložení se nezdařilo');
    } finally {
      setLoading(false);
    }
  };

  const saveSiteAnnouncement = async () => {
    setLoading(true);
    setToast('');
    try {
      const res = await fetch('/api/pizza/capacity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteAnnouncement }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Uložení se nezdařilo');
      setSiteAnnouncement((prev) => ({ ...prev, ...(data.siteAnnouncement ?? {}) }));
      setToast('Horní lišta uložena');
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Uložení se nezdařilo');
    } finally {
      setLoading(false);
    }
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

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-ivory">
      <header className="sticky top-0 z-20 border-b border-navy/5 bg-ivory/95 backdrop-blur-md">
        <div className="px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SiteLogo size="sm" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Kuchyně</p>
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

          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-navy/5 bg-white px-3 py-2.5 shadow-sm">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-navy/45">Kapacita dnes</p>
              <p className="font-serif text-xl font-bold text-navy">
                {remaining}
                <span className="text-sm font-normal text-navy/40"> / {maxPizzas}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateMaxPizzas(-5)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy/10 bg-cream text-navy transition hover:bg-gold/15"
                aria-label="Snížit kapacitu"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateMaxPizzas(5)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy/10 bg-cream text-navy transition hover:bg-gold/15"
                aria-label="Zvýšit kapacitu"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggleAccepting}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  accepting
                    ? 'bg-navy text-ivory'
                    : 'bg-terracotta/15 text-terracotta ring-1 ring-terracotta/30'
                }`}
              >
                {accepting ? 'Přijímáme' : 'Pozastaveno'}
              </button>
            </div>
          </div>
        </div>

        <nav className="grid grid-cols-3 gap-1 border-t border-navy/5 px-2 pb-2 pt-2" aria-label="Sekce kuchyně">
          {kitchenTabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const showBadge = id === 'orders' && pendingCount > 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-semibold transition ${
                  isActive ? 'bg-navy text-ivory shadow-sm' : 'text-navy/55 hover:bg-white hover:text-navy'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {showBadge && (
                  <span
                    className={`absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                      isActive ? 'bg-gold text-navy' : 'bg-gold text-navy'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {toast && (
        <div className="mx-4 mt-3 rounded-2xl bg-terracotta/10 px-4 py-3 text-center text-sm font-medium text-terracotta ring-1 ring-terracotta/20">
          {toast}
        </div>
      )}

      <main className="flex-1 px-4 pb-8 pt-4">
        {activeTab === 'orders' && (
          <>
            {pendingCount > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-gold px-4 py-2.5 text-sm font-semibold text-navy shadow-sm">
                <Bell className="h-4 w-4 shrink-0" />
                {pendingCount}{' '}
                {pendingCount === 1 ? 'nová objednávka' : pendingCount < 5 ? 'nové objednávky' : 'nových objednávek'}
              </div>
            )}

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
                      order.status === 'pending' ? 'border-gold/50 ring-2 ring-gold/25' : 'border-navy/5'
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
                          Hotovo k vyzvednutí
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

            {doneOrders.length > 0 && (
              <section className="mt-6">
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
                        <span className="font-medium text-navy/80">#{order.id}</span>, {order.customerName} ·{' '}
                        {statusLabels[order.status]}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}

        {activeTab === 'pizza' && (
          <div className="space-y-3">
            <KitchenAccordion
              title="Kapacita dnes"
              subtitle={`${remaining} / ${maxPizzas} pizz zbývá`}
              open={openSections['pizza-capacity']}
              onToggle={() => toggleSection('pizza-capacity')}
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-serif text-3xl font-bold text-navy">
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
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${capacityPct}%` }} />
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
            </KitchenAccordion>
          </div>
        )}

        {activeTab === 'web' && (
          <div className="space-y-3">
            <KitchenAccordion
              title="Horní info lišta"
              subtitle={siteAnnouncement.enabled ? siteAnnouncement.message || 'Zapnuto' : 'Vypnuto'}
              open={openSections['web-banner']}
              onToggle={() => toggleSection('web-banner')}
            >
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setSiteAnnouncement((prev) => ({
                      ...prev,
                      enabled: !prev.enabled,
                    }))
                  }
                  className={`w-full rounded-2xl py-3 text-sm font-semibold transition ${
                    siteAnnouncement.enabled
                      ? 'bg-forest text-ivory hover:bg-forest-light'
                      : 'bg-terracotta/15 text-terracotta ring-1 ring-terracotta/30'
                  }`}
                >
                  {siteAnnouncement.enabled ? 'Lišta je zapnutá' : 'Lišta je vypnutá'}
                </button>
                <textarea
                  rows={3}
                  value={siteAnnouncement.message}
                  onChange={(e) => setSiteAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Např. Dnes nepečeme pizzu. Restaurace funguje beze změny."
                  className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={siteAnnouncement.linkLabel}
                    onChange={(e) => setSiteAnnouncement((prev) => ({ ...prev, linkLabel: e.target.value }))}
                    placeholder="Text odkazu"
                    className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <input
                    type="text"
                    value={siteAnnouncement.href}
                    onChange={(e) => setSiteAnnouncement((prev) => ({ ...prev, href: e.target.value }))}
                    placeholder="/pizza nebo https://..."
                    className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['info', 'warning', 'important'] as const).map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      disabled={loading}
                      onClick={() => setSiteAnnouncement((prev) => ({ ...prev, variant }))}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        siteAnnouncement.variant === variant
                          ? 'bg-navy text-ivory'
                          : 'border border-navy/10 bg-cream text-navy'
                      }`}
                    >
                      {variant === 'info' ? 'Info' : variant === 'warning' ? 'Upozornění' : 'Důležité'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={saveSiteAnnouncement}
                  className="w-full rounded-2xl bg-gold py-3 text-sm font-semibold text-navy transition hover:bg-gold-light disabled:opacity-50"
                >
                  Uložit horní lištu
                </button>
              </div>
            </KitchenAccordion>

            <KitchenAccordion
              title="Stavová pilulka"
              subtitle={openingModeLabels[openingStatus.mode ?? 'auto']}
              open={openSections['web-pill']}
              onToggle={() => toggleSection('web-pill')}
            >
              <div className="space-y-3">
                <div className="rounded-2xl bg-navy px-4 py-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ivory/45">Náhled na webu</p>
                  <OpeningStatusPill
                    variant="onDark"
                    showPhone={false}
                    settings={openingStatus}
                    initialStatus={getOpeningStatus(new Date(), openingStatus)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'open', 'closed'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={loading}
                      onClick={() => setOpeningStatus((prev) => ({ ...prev, mode }))}
                      className={`rounded-2xl px-2 py-3 text-xs font-semibold transition sm:text-sm ${
                        (openingStatus.mode ?? 'auto') === mode
                          ? mode === 'open'
                            ? 'bg-forest text-ivory'
                            : mode === 'closed'
                              ? 'bg-terracotta text-ivory'
                              : 'bg-navy text-ivory'
                          : 'border border-navy/10 bg-cream text-navy'
                      }`}
                    >
                      {mode === 'auto' ? 'Auto' : mode === 'open' ? 'Otevřeno' : 'Zavřeno'}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={openingStatus.openLabel}
                  onChange={(e) => setOpeningStatus((prev) => ({ ...prev, openLabel: e.target.value }))}
                  placeholder="Text při otevření"
                  className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <input
                  type="text"
                  value={openingStatus.closedLabel}
                  onChange={(e) => setOpeningStatus((prev) => ({ ...prev, closedLabel: e.target.value }))}
                  placeholder="Text při zavření"
                  className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={openingStatus.opensTodayLabel}
                    onChange={(e) => setOpeningStatus((prev) => ({ ...prev, opensTodayLabel: e.target.value }))}
                    placeholder="Před dnešním časem"
                    className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <input
                    type="text"
                    value={openingStatus.opensAnotherDayLabel}
                    onChange={(e) =>
                      setOpeningStatus((prev) => ({ ...prev, opensAnotherDayLabel: e.target.value }))
                    }
                    placeholder="Před dalším dnem"
                    className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <input
                  type="text"
                  value={openingStatus.untilLabel}
                  onChange={(e) => setOpeningStatus((prev) => ({ ...prev, untilLabel: e.target.value }))}
                  placeholder="Text před koncem otevírací doby"
                  className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={saveOpeningStatus}
                  className="w-full rounded-2xl bg-gold py-3 text-sm font-semibold text-navy transition hover:bg-gold-light disabled:opacity-50"
                >
                  Uložit stavovou pilulku
                </button>
              </div>
            </KitchenAccordion>
          </div>
        )}
      </main>
    </div>
  );
}
