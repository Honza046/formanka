import type { MenuCategory } from '@/lib/data';

type MenuListProps = {
  categories: MenuCategory[];
};

export default function MenuList({ categories }: MenuListProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category.name}>
          <h2 className="mb-4 font-serif text-2xl font-bold text-slate-deep">{category.name}</h2>
          <ul className="divide-y divide-slate-deep/5 rounded-3xl border border-slate-deep/5 bg-white shadow-sm">
            {category.items.map((item) => (
              <li
                key={`${category.name}-${item.name}-${item.description ?? ''}`}
                className="flex items-start justify-between gap-6 px-6 py-5 transition-colors hover:bg-forest/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-deep">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-deep/50">{item.description}</p>
                  )}
                </div>
                {item.price && (
                  <span className="shrink-0 text-sm font-semibold text-forest">{item.price}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
