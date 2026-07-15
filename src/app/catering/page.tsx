import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
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
        compact
        eyebrow="Akce & oslavy"
        title={cateringInfo.title}
        description={cateringInfo.intro}
      />

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-2 sm:gap-4">
            {services.slice(0, 2).map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-slate-deep/5 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
              >
                <p className="text-sm font-medium text-slate-deep sm:text-base">{service}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-4 font-serif text-xl font-bold text-slate-deep sm:mb-6 sm:text-2xl">
            Co u nás pořádáme
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {cateringEvents.map((event) => (
              <li
                key={event.title}
                className="rounded-2xl border border-slate-deep/5 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
              >
                <h3 className="font-serif text-base font-bold text-slate-deep sm:text-lg">
                  {event.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-deep/60">{event.description}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl bg-slate-deep p-5 text-ivory sm:mt-10 sm:rounded-3xl sm:p-8 lg:p-10">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{offerIntro.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/80 sm:mt-4 sm:text-base">
              {cateringInfo.rauts}
            </p>
            <ul className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2">
              {services.slice(2).map((service) => (
                <li key={service} className="flex items-center gap-2 text-sm text-ivory/90">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-muted" />
                  {service}
                </li>
              ))}
            </ul>
            <Link
              href="#poptavka"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light sm:mt-6 sm:w-auto"
            >
              Poptat catering
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="poptavka" className="border-t border-slate-deep/5 bg-ivory px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-forest p-4 shadow-lg sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center lg:max-w-none lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-muted sm:text-sm">
                Nezávazně
              </p>
              <h2 className="mt-1.5 font-serif text-2xl font-bold text-ivory sm:mt-2 sm:text-3xl">
                Poptat catering
              </h2>
              <p className="mt-2 text-sm text-ivory/80 sm:mt-3 sm:text-base">
                Vyplňte formulář — ozveme se s nabídkou na míru.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-white/20"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {phone}
                  </a>
                ))}
              </div>
              <p className="mt-2 text-xs text-ivory/60 sm:text-sm">
                nebo{' '}
                <a href={`mailto:${site.email}`} className="font-medium text-ivory hover:underline">
                  {site.email}
                </a>
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-white p-5 text-left shadow-md sm:mt-8 sm:rounded-2xl sm:p-8 lg:p-10">
              <CateringInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
