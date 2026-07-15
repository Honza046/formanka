import type { Metadata } from 'next';
import { Clock, Facebook, Instagram, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import MapEmbed from '@/components/MapEmbed';
import PageHero from '@/components/PageHero';
import { openingHours, site } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Kontakt | Na Formance - Žeravice',
  description: 'Kontaktujte restauraci Na Formance v Žeravicích. Žeravice 36, 696 47.',
};

export default function KontaktPage() {
  return (
    <main>
      <PageHero
        eyebrow="Jsme tu pro vás"
        title="Kontaktujte nás"
        description="Máte dotaz, chcete uspořádat akci nebo objednat pizzu? Napište nám nebo zavolejte."
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-deep">Kontakty</h2>
            <ul className="mt-4 space-y-3 text-slate-deep/80">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-forest">
                  {site.email}
                </a>
              </li>
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-forest">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-deep/5 text-slate-deep transition-colors hover:bg-forest/10 hover:text-forest"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-deep/5 text-slate-deep transition-colors hover:bg-forest/10 hover:text-forest"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-slate-deep">Adresa</h2>
            <address className="mt-4 not-italic text-slate-deep/80">
              {site.address.street}
              <br />
              {site.address.zip}, {site.address.city}
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Navigovat v Mapách
            </a>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-slate-deep">Otevírací doba</h2>
            <ul className="mt-4 space-y-1.5">
              {openingHours.map(({ day, hours }) => (
                <li key={day} className="flex justify-between gap-4 text-sm text-slate-deep/80">
                  <span>{day}</span>
                  <span className={`font-medium ${hours === 'Zavřeno' ? 'text-slate-deep/45' : 'text-slate-deep'}`}>
                    {hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-deep/5 shadow-sm">
          <MapEmbed minHeightClass="min-h-[360px] sm:min-h-[420px]" />
        </div>
      </section>

      <section className="border-t border-slate-deep/5 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-terracotta">
            <Clock className="h-4 w-4" />
            Napište nám
          </div>
          <div className="rounded-3xl border border-slate-deep/5 bg-ivory p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
