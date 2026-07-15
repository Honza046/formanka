import Link from 'next/link';
import { site } from '@/lib/data';

export default function CtaBanner() {
  return (
    <section className="bg-forest px-4 py-14 text-center text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{site.ctaQuote}</h2>
        <Link
          href="/kontakt"
          className="mt-6 inline-flex rounded-2xl bg-gold px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
        >
          Kontaktujte nás
        </Link>
      </div>
    </section>
  );
}
