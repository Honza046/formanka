'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import {
  cateringEventTypes,
  cateringMenuOptions,
  cateringVenueOptions,
  guestCountRanges,
  site,
} from '@/lib/data';

const STEPS = [
  { id: 1, label: 'Kontakt', icon: Users },
  { id: 2, label: 'Akce', icon: CalendarHeart },
  { id: 3, label: 'Menu', icon: UtensilsCrossed },
] as const;

const inputClass =
  'w-full rounded-xl border border-slate-deep/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20 sm:px-4 sm:py-3 sm:text-base';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestRange: string;
  guestsExact: string;
  venue: string;
  menuItems: string[];
  message: string;
};

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  eventTime: '',
  guestRange: '',
  guestsExact: '',
  venue: '',
  menuItems: [],
  message: '',
};

function formatDateCs(iso: string): string {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildMailtoBody(data: FormData) {
  const guestLabel =
    guestCountRanges.find((r) => r.value === data.guestRange)?.label ?? data.guestRange;

  const lines = [
    'Nezávazná poptávka cateringu — Na Formance Žeravice',
    '',
    `Jméno: ${[data.firstName, data.lastName].filter(Boolean).join(' ')}`,
    `E-mail: ${data.email}`,
    `Telefon: ${data.phone}`,
    '',
    `Typ akce: ${data.eventType}`,
    data.eventDate ? `Datum: ${formatDateCs(data.eventDate)}` : null,
    data.eventTime ? `Čas akce: ${data.eventTime}` : null,
    data.guestRange ? `Počet hostů: ${guestLabel}` : null,
    data.guestsExact ? `Upřesnění počtu: ${data.guestsExact}` : null,
    data.venue ? `Prostor: ${data.venue}` : null,
    data.menuItems.length ? `Zájem o menu: ${data.menuItems.join(', ')}` : null,
    '',
    'Poznámka / požadavky:',
    data.message,
  ].filter(Boolean);

  return lines.join('\n');
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base ${
        selected
          ? 'border-forest bg-forest/5 font-semibold text-forest ring-2 ring-forest/20'
          : 'border-slate-deep/10 bg-white text-slate-deep hover:border-slate-deep/20'
      }`}
    >
      {children}
    </button>
  );
}

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex items-center justify-between gap-1 sm:gap-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const done = current > step.id;
          const active = current === step.id;
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                    active
                      ? 'bg-forest text-ivory'
                      : done
                        ? 'bg-forest/20 text-forest'
                        : 'bg-slate-deep/10 text-slate-deep/40'
                  }`}
                >
                  {done ? '✓' : <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </span>
                <span
                  className={`text-[11px] font-medium sm:text-xs ${
                    active ? 'text-forest' : done ? 'text-slate-deep/70' : 'text-slate-deep/40'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-1 mb-5 h-0.5 flex-1 rounded sm:mx-2 sm:mb-6 ${
                    current > step.id ? 'bg-forest/40' : 'bg-slate-deep/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CateringInquiryForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleMenuItem = (item: string) => {
    setForm((prev) => ({
      ...prev,
      menuItems: prev.menuItems.includes(item)
        ? prev.menuItems.filter((i) => i !== item)
        : [...prev.menuItems, item],
    }));
    setError('');
  };

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim()) {
        setError('Vyplňte prosím jméno, e-mail a telefon.');
        return false;
      }
    }
    if (s === 2) {
      if (!form.eventType) {
        setError('Vyberte typ akce.');
        return false;
      }
    }
    if (s === 3) {
      if (!form.message.trim()) {
        setError('Napište nám alespoň stručně, co si představujete.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    const subject = encodeURIComponent(`Poptávka cateringu — ${form.eventType}`);
    const body = encodeURIComponent(buildMailtoBody(form));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm(initialForm);
    setStep(1);
    setError('');
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-forest/20 bg-forest/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest" />
        <h3 className="mt-4 font-serif text-2xl font-bold text-slate-deep">Poptávka připravena</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-deep/70">
          Otevřeli jsme vám e-mail s předvyplněnou zprávou. Stačí ji odeslat — ozveme se co nejdříve
          s nabídkou na míru.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {site.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${site.email}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
        >
          <Mail className="h-4 w-4" />
          {site.email}
        </a>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 block w-full text-sm font-medium text-forest hover:underline"
        >
          Odeslat další poptávku
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepProgress current={step} />

      <div>
        {step === 1 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-deep sm:text-xl">
              Kontaktní údaje
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="catering-first-name" className="mb-1.5 block text-sm font-medium">
                  Jméno <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  id="catering-first-name"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="catering-last-name" className="mb-1.5 block text-sm font-medium">
                  Příjmení
                </label>
                <input
                  type="text"
                  id="catering-last-name"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="catering-email" className="mb-1.5 block text-sm font-medium">
                  E-mail <span className="text-terracotta">*</span>
                </label>
                <input
                  type="email"
                  id="catering-email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="catering-phone" className="mb-1.5 block text-sm font-medium">
                  Telefon <span className="text-terracotta">*</span>
                </label>
                <input
                  type="tel"
                  id="catering-phone"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+420 ..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 sm:space-y-5">
            <h3 className="font-serif text-lg font-bold text-slate-deep sm:text-xl">O akci</h3>
            <div>
              <p className="mb-2 text-sm font-medium sm:text-base">
                Typ akce <span className="text-terracotta">*</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                {cateringEventTypes.map((type) => (
                  <ChoiceButton
                    key={type}
                    selected={form.eventType === type}
                    onClick={() => update('eventType', type)}
                  >
                    {type}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="catering-event-date" className="mb-1.5 block text-sm font-medium">
                  Datum akce
                </label>
                <input
                  type="date"
                  id="catering-event-date"
                  min={today}
                  value={form.eventDate}
                  onChange={(e) => update('eventDate', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="catering-event-time" className="mb-1.5 block text-sm font-medium">
                  Přibližný čas
                </label>
                <input
                  type="time"
                  id="catering-event-time"
                  value={form.eventTime}
                  onChange={(e) => update('eventTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium sm:text-base">Počet hostů</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {guestCountRanges.map((range) => (
                  <ChoiceButton
                    key={range.value}
                    selected={form.guestRange === range.value}
                    onClick={() => update('guestRange', range.value)}
                  >
                    {range.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium sm:text-base">
                <MapPin className="h-4 w-4 shrink-0 text-forest/70" />
                Prostor
              </p>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                {cateringVenueOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    selected={form.venue === option}
                    onClick={() => update('venue', option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 sm:space-y-5">
            <h3 className="font-serif text-lg font-bold text-slate-deep sm:text-xl">
              Menu a požadavky
            </h3>
            <div>
              <p className="mb-2 text-sm font-medium sm:text-base">Co vás zajímá?</p>
              <div className="flex flex-wrap gap-2">
                {cateringMenuOptions.map((item) => {
                  const selected = form.menuItems.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMenuItem(item)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:py-2 sm:text-sm ${
                        selected
                          ? 'bg-forest text-ivory'
                          : 'bg-slate-deep/5 text-slate-deep hover:bg-slate-deep/10'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="catering-message" className="mb-1.5 block text-sm font-medium">
                Poznámka / speciální požadavky <span className="text-terracotta">*</span>
              </label>
              <textarea
                id="catering-message"
                rows={3}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Styl menu, alergie, průběh akce, rozpočet…"
                className={`${inputClass} resize-y`}
              />
            </div>
            <p className="text-xs leading-relaxed text-slate-deep/50">
              Odesláním souhlasíte se zpracováním údajů. Poptávka je nezávazná.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>
      )}

      <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-deep/5 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-deep/10 px-5 py-2.5 text-sm font-semibold text-slate-deep transition-colors hover:border-slate-deep/20 sm:w-auto sm:rounded-2xl sm:py-3 sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto sm:rounded-2xl sm:py-3 sm:text-base"
          >
            Pokračovat
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto sm:rounded-2xl sm:py-3 sm:text-base"
          >
            <Send className="h-4 w-4" />
            Odeslat poptávku
          </button>
        )}
      </div>
    </form>
  );
}
