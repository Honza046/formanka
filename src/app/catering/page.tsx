import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import CateringInquiryForm from '@/components/CateringInquiryForm';
import { cateringEvents, cateringInfo, offerIntro, services, site } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Catering & akce | Na Formance - Žeravice',
  description: 'Catering, svatby, oslavy a firemní akce v Žeravicích u Kyjova.',
};

export default function CateringPage() {
  return (
    <main>
      <PageHero
        eyebrow="Akce & oslavy"
        title={cateringInfo.title}
        description={cateringInfo.intro}
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            {services.slice(0, 2).map((service) => (
              <div
                key={service}
                className="rounded-3xl border border-slate-deep/5 bg-white p-6 shadow-sm"
              >
                <p className="font-medium text-slate-deep">{service}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-6 font-serif text-2xl font-bold text-slate-deep">Co u nás pořádáme</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cateringEvents.map((event) => (
              <li
                key={event.title}
                className="rounded-3xl border border-slate-deep/5 bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-lg font-bold text-slate-deep">{event.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-deep/60">{event.description}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-3xl bg-slate-deep p-8 text-ivory sm:p-10">
            <h2 className="font-serif text-2xl font-bold">{offerIntro.title}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ivory/80">{cateringInfo.rauts}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {services.slice(2).map((service) => (
                <li key={service} className="flex items-center gap-2 text-sm text-ivory/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta-muted" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Poptávkový formulář */}
      <section id="poptavka" className="border-t border-slate-deep/5 bg-ivory px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl bg-forest px-6 py-10 text-center shadow-lg sm:px-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-muted">
              Nezávazně
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ivory">Poptat catering</h2>
            <p className="mt-4 text-ivory/80">
              Vyplňte formulář — ozveme se s nabídkou na míru.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {site.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-white/20"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {phone}
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-ivory/60">
              nebo{' '}
              <a href={`mailto:${site.email}`} className="font-medium text-ivory hover:underline">
                {site.email}
              </a>
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6 text-left shadow-md sm:p-8">
              <CateringInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
