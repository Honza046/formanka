'use client';

import { FormEvent, useState } from 'react';
import { site } from '@/lib/data';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get('first-name') ?? '').trim();
    const lastName = String(form.get('last-name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    const subject = encodeURIComponent(`Dotaz z webu – ${firstName} ${lastName}`.trim());
    const body = encodeURIComponent(
      [`Jméno: ${firstName} ${lastName}`.trim(), `E-mail: ${email}`, '', message].join('\n'),
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus('ready');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="mb-1.5 block text-sm font-medium text-slate-deep">
            Jméno
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="mb-1.5 block text-sm font-medium text-slate-deep">
            Příjmení
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-deep">
          E-mail <span className="text-terracotta">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-deep">
          Zpráva <span className="text-terracotta">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full resize-y rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </div>

      {status === 'ready' && (
        <p className="text-sm text-navy/60">
          Otevřel se e-mailový klient — zprávu prosím odešlete.
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-2xl bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto"
      >
        Poslat
      </button>
    </form>
  );
}
