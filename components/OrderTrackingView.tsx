'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Loader2, Package, Phone } from 'lucide-react';
import type { CustomerOrderView } from '@/lib/pizza-orders/customer-status';
import { statusSteps } from '@/lib/pizza-orders/customer-status';
import type { OrderStatus } from '@/lib/pizza-orders/types';
import { site } from '@/lib/data';

const stepLabels: Record<OrderStatus, string> = {
  pending: 'Odesláno',
  confirmed: 'Potvrzeno',
  ready: 'Hotovo',
  completed: 'Vyzvednuto',
  rejected: 'Zamítnuto',
};

function storageKey(orderId: string): string {
  return `formanka-order-phone:${orderId}`;
}

type Props = {
  orderId: string;
  initialPhone?: string;
};

export default function OrderTrackingView({ orderId, initialPhone = '' }: Props) {
  const [phone, setPhone] = useState(initialPhone);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [order, setOrder] = useState<CustomerOrderView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(
    async (phoneValue: string) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(
          `/api/pizza/orders/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phoneValue)}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Stav se nepodařilo načíst.');
        setOrder(data.order);
        setVerifiedPhone(phoneValue);
        sessionStorage.setItem(storageKey(orderId), phoneValue);
      } catch (err) {
        setOrder(null);
        setError(err instanceof Error ? err.message : 'Chyba při načítání.');
      } finally {
        setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey(orderId)) ?? initialPhone;
    if (saved) {
      setPhone(saved);
      fetchStatus(saved);
    }
  }, [orderId, initialPhone, fetchStatus]);

  useEffect(() => {
    if (!verifiedPhone) return;
    const interval = setInterval(() => fetchStatus(verifiedPhone), 10_000);
    return () => clearInterval(interval);
  }, [verifiedPhone, fetchStatus]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(phone.trim());
  };

  const pickupLabel = order
    ? new Date(order.pickupTime).toLocaleString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const activeStepIndex =
    order?.status === 'rejected'
      ? -1
      : statusSteps.indexOf(order?.status ?? 'pending');

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {!order && (
        <form onSubmit={handleVerify} className="rounded-3xl border border-slate-deep/5 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-slate-deep">Ověření objednávky</h2>
          <p className="mt-2 text-sm text-slate-deep/60">
            Zadejte telefon z objednávky (stačí poslední 4 číslice).
          </p>
          <p className="mt-1 text-sm font-medium text-slate-deep">
            Číslo objednávky: <span className="font-mono">#{orderId}</span>
          </p>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon z objednávky"
            className="mt-4 w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-3 text-center text-lg outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
          {error && <p className="mt-3 text-center text-sm text-terracotta">{error}</p>}
          <button
            type="submit"
            disabled={loading || phone.trim().length < 4}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-3 text-sm font-semibold text-ivory disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Zobrazit stav
          </button>
        </form>
      )}

      {order && (
        <>
          <div
            className={`rounded-3xl border p-6 sm:p-8 ${
              order.status === 'rejected'
                ? 'border-terracotta/20 bg-terracotta/5'
                : order.status === 'ready'
                  ? 'border-forest/20 bg-forest/5'
                  : 'border-slate-deep/5 bg-white'
            }`}
          >
            <p className="text-sm font-medium text-slate-deep/50">Objednávka #{order.id}</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-deep">{order.statusLabel}</h2>
            <p className="mt-2 text-sm text-slate-deep/70">{order.statusHint}</p>

            {order.status !== 'rejected' && (
              <ol className="mt-6 flex justify-between gap-1">
                {statusSteps.map((step, index) => {
                  const done = activeStepIndex >= index;
                  const current = activeStepIndex === index;
                  return (
                    <li key={step} className="flex flex-1 flex-col items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? 'bg-forest text-ivory'
                            : 'bg-slate-deep/10 text-slate-deep/40'
                        } ${current ? 'ring-2 ring-forest/30' : ''}`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </span>
                      <span
                        className={`text-center text-[10px] font-medium leading-tight sm:text-xs ${
                          done ? 'text-forest' : 'text-slate-deep/40'
                        }`}
                      >
                        {stepLabels[step]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-ivory px-4 py-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-deep/50">
                  Vyzvednutí
                </p>
                <p className="font-medium text-slate-deep">{pickupLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-deep/5 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-deep">
              <Package className="h-4 w-4 text-forest" />
              {order.customerName}
            </div>
            <ul className="mt-4 space-y-2 border-t border-slate-deep/5 pt-4">
              {order.items.map((item, index) => (
                <li key={index} className="text-sm text-slate-deep">
                  {item.label}
                </li>
              ))}
            </ul>
            {order.note && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {order.note}
              </p>
            )}
            <p className="mt-3 text-xs text-slate-deep/50">{order.paymentMethod}</p>
          </div>

          {order.status === 'rejected' && (
            <a
              href={`tel:${site.phones[0]?.replace(/\s/g, '')}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-deep/10 bg-white py-3 text-sm font-semibold text-slate-deep"
            >
              <Phone className="h-4 w-4" />
              Zavolat do restaurace
            </a>
          )}

          <p className="text-center text-xs text-slate-deep/40">
            Stav se obnovuje automaticky každých 10 sekund.
          </p>
        </>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/pizza/objednat"
          className="text-center text-sm font-semibold text-forest hover:underline"
        >
          Nová objednávka
        </Link>
        <Link href="/" className="text-center text-sm text-slate-deep/60 hover:text-slate-deep">
          Zpět na web
        </Link>
      </div>
    </div>
  );
}
