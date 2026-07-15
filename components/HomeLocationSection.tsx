import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import MapEmbed from '@/components/MapEmbed';
import { HOME_SURFACE_RADIUS } from '@/lib/home-layout';
import { site } from '@/lib/data';

export default function HomeLocationSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Kde nás najdete</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">{site.address.note}</h2>
          <p className="mx-auto mt-3 max-w-lg text-navy/60">
            Restaurace Na Formance — {site.address.street}, {site.address.zip} {site.address.city}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <div
            className={`relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-full lg:h-full ${HOME_SURFACE_RADIUS} border border-navy/5 shadow-sm`}
          >
            <MapEmbed fill />
          </div>

          <div className={`flex flex-col justify-between ${HOME_SURFACE_RADIUS} border border-navy/5 bg-cream p-6 sm:p-8`}>
            <div>
              <h3 className="font-serif text-xl font-bold text-navy">Adresa</h3>
              <address className="mt-4 not-italic text-navy/70">
                {site.name}
                <br />
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
                <br />
                {site.address.region}
              </address>
              <p className="mt-4 text-sm text-navy/55">
                Parkování u restaurace, letní zahrádka s výhledem do okolí.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                <MapPin className="h-4 w-4" />
                Navigovat v Mapách
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy ring-1 ring-navy/10 transition hover:ring-gold/40"
              >
                Kontakt a rezervace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
