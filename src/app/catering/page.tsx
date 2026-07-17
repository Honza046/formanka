import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { Phone } from 'lucide-react';
import CateringOfferBanner from '@/components/CateringOfferBanner';
import PageHero from '@/components/PageHero';
import CateringInquiryForm from '@/components/CateringInquiryForm';
import { cateringEvents, cateringInfo, services, site, pageHeroImages } from '@/lib/data';
import { getStore } from '@/lib/pizza-orders/store';

export const metadata: Metadata = {
  title: 'Catering & akce | Na Formance Žeravice',
  description: 'Catering, svatby, oslavy a firemní akce v Žeravicích u Kyjova.',
};

export default async function CateringPage() {
  noStore();
  const store = await getStore();
  const content = store.websiteContent.catering;

  return (
    <main>
      <PageHero
        compact
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={pageHeroImages.catering.image}
        imageAlt={pageHeroImages.catering.imageAlt}
        imagePosition="right"
      />

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-2 sm:gap-4">
            {services.slice(0, 2).map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-navy/5 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
              >
                <p className="text-sm font-medium text-navy sm:text-base">{service}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-4 font-serif text-xl font-bold text-navy sm:mb-6 sm:text-2xl">
            Co u nás pořádáme
          </h2>
          <div className="w-fit mx-auto">
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {cateringEvents.slice(0, 3).map((event) => (
                <li
                  key={event.title}
                  className="flex h-full flex-col rounded-2xl border border-navy/5 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
                >
                  <h3 className="font-serif text-base font-bold text-navy sm:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60">{event.description}</p>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:w-fit lg:mx-auto">
              {cateringEvents.slice(3, 5).map((event) => (
                <li
                  key={event.title}
                  className="flex h-full flex-col rounded-2xl border border-navy/5 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
                >
                  <h3 className="font-serif text-base font-bold text-navy sm:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60">{event.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 sm:mt-10">
            <CateringOfferBanner />
          </div>
        </div>
      </section>

      <section id="poptavka" className="border-t border-slate-deep/5 bg-ivory px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-forest p-4 shadow-lg sm:rounded-3xl sm:p-5 lg:p-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-muted sm:text-sm">
                {content.inquiryEyebrow}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ivory sm:mt-1.5 sm:text-3xl">
                {content.inquiryTitle}
              </h2>
              <p className="mt-1.5 text-sm text-ivory/80 sm:mt-2 sm:text-base">
                {content.inquiryDescription}
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:justify-center">
                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-medium text-ivory transition-colors hover:bg-white/20"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {phone}
                  </a>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-ivory/60 sm:text-sm">
                nebo{' '}
                <a href={`mailto:${site.email}`} className="font-medium text-ivory hover:underline">
                  {site.email}
                </a>
              </p>
            </div>

            <div className="mx-auto mt-4 max-w-3xl rounded-xl bg-white p-3 text-left shadow-md sm:mt-5 sm:rounded-2xl sm:p-4 lg:p-5">
              <CateringInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
