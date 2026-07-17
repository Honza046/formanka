import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { getOpeningStatus } from '@/lib/opening-status';
import { openingHours, site } from '@/lib/data';
import type { OpeningStatusSettings } from '@/lib/pizza-orders/types';

export default function Footer({
  openingStatusSettings,
}: {
  openingStatusSettings?: Partial<OpeningStatusSettings>;
}) {
  const year = new Date().getFullYear();
  const status = getOpeningStatus(new Date(), openingStatusSettings);
  const openDays = openingHours.filter((entry) => entry.hours !== 'Zavřeno');

  return (
    <footer className="bg-navy text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <SiteLogo size="sm" className="ring-white/15" />
              <div>
                <p className="font-serif text-xl font-bold text-white">{site.name}</p>
                <p className="text-sm text-ivory/55">{site.address.note}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">{site.description}</p>
            <div className="mt-5 flex gap-2">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ivory/80 transition hover:bg-white/10 hover:text-gold-light"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ivory/80 transition hover:bg-white/10 hover:text-gold-light"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent('Dotaz Na Formance Žeravice')}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-ivory/80 transition hover:bg-white/10 hover:text-gold-light"
                aria-label="Napsat e-mail"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Kontakt</h3>
            <ul className="mt-4 space-y-3">
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-sm text-ivory/80 transition hover:text-gold-light"
                  >
                    <Phone className="h-4 w-4 text-gold/80" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm text-ivory/80 transition hover:text-gold-light"
                >
                  <Mail className="h-4 w-4 text-gold/80" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-ivory/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.zip}, {site.address.city}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Otevírací doba</h3>
            <p className="mt-4 text-sm font-medium text-ivory">
              {status.isOpen ? status.message : status.alternateMessage || status.message}
            </p>
            <ul className="mt-4 space-y-1.5">
              {openDays.map(({ day, hours }) => (
                <li key={day} className="flex justify-between gap-4 text-sm">
                  <span className="text-ivory/50">{day}</span>
                  <span className="font-medium text-ivory/85">{hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ivory/40">Po–Út zavřeno</p>
            <Link
              href="/kontakt"
              className="mt-5 inline-flex text-sm font-semibold text-gold-light transition hover:text-gold"
            >
              Kontakt a rezervace →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/40">
        &copy; {year} {site.name}. Všechna práva vyhrazena.
      </div>
    </footer>
  );
}
