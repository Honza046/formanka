import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-slate-deep/5 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-serif text-4xl font-bold text-slate-deep sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-deep/70">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
