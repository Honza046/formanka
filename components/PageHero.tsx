import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
};

export default function PageHero({ eyebrow, title, description, children, compact }: PageHeroProps) {
  return (
    <section
      className={`border-b border-slate-deep/5 bg-white px-4 sm:px-6 lg:px-8 ${
        compact ? 'py-10 sm:py-12' : 'py-14 sm:py-16'
      }`}
    >
      <div className="mx-auto max-w-4xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">{eyebrow}</p>
        )}
        <h1
          className={`mt-2 font-serif font-bold text-slate-deep ${
            compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-4 max-w-2xl leading-relaxed text-slate-deep/70 ${
              compact ? 'text-base sm:text-lg' : 'text-lg'
            }`}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
