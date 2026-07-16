import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { openingHours, site } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-deep/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <SiteLogo size="sm" />
            <p className="mt-3 text-sm text-slate-deep/60">{site.description}</p>
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
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent('Dotaz Na Formance Žeravice')}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-deep/5 text-slate-deep transition-colors hover:bg-forest/10 hover:text-forest"
                aria-label="Napsat e-mail"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-terracotta">Kontakt</h3>
            <ul className="mt-4 space-y-3">
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-sm text-slate-deep hover:text-forest"
                  >
                    <Phone className="h-4 w-4" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-deep hover:text-forest"
                >
                  <Mail className="h-4 w-4" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-deep/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.zip}, {site.address.city}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-terracotta">Otevírací doba</h3>
            <ul className="mt-4 space-y-1.5">
              {openingHours.map(({ day, hours }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-slate-deep/60">{day}</span>
                  <span
                    className={`font-medium ${hours === 'Zavřeno' ? 'text-slate-deep/45' : 'text-slate-deep'}`}
                  >
                    {hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-deep/5 py-6 text-center text-xs text-slate-deep/40">
        &copy; {year} {site.name}. Všechna práva vyhrazena.
      </div>
    </footer>
  );
}
