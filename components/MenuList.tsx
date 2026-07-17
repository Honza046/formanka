import type { MenuCategory } from '@/lib/data';

type MenuListProps = {
  categories: MenuCategory[];
};

function MenuRow({ item }: { item: MenuCategory['items'][number] }) {
  return (
    <li className="flex list-none items-baseline justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-forest/[0.02] sm:px-6">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-slate-deep">{item.name}</h3>
        {item.description && <p className="mt-1 text-sm text-slate-deep/50">{item.description}</p>}
      </div>
      {item.price && <span className="shrink-0 text-sm font-semibold text-forest">{item.price}</span>}
    </li>
  );
}

function CategorySection({
  category,
  itemColumns = 1,
}: {
  category: MenuCategory;
  itemColumns?: 1 | 2;
}) {
  const mid = Math.ceil(category.items.length / 2);
  const leftItems = category.items.slice(0, mid);
  const rightItems = category.items.slice(mid);

  return (
    <section>
      <h2 className="mb-4 font-serif text-2xl font-bold text-slate-deep">{category.name}</h2>
      <div
        className={`overflow-hidden rounded-3xl border border-slate-deep/5 bg-white shadow-sm ${
          itemColumns === 2 ? 'md:grid md:grid-cols-2 md:divide-x md:divide-slate-deep/5' : ''
        }`}
      >
        {itemColumns === 2 ? (
          <>
            <ul className="divide-y divide-slate-deep/5 md:hidden">
              {category.items.map((item) => (
                <MenuRow key={`${category.name}-${item.name}-${item.description ?? ''}`} item={item} />
              ))}
            </ul>
            <ul className="hidden divide-y divide-slate-deep/5 md:block">
              {leftItems.map((item) => (
                <MenuRow key={`${category.name}-${item.name}-${item.description ?? ''}-a`} item={item} />
              ))}
            </ul>
            <ul className="hidden divide-y divide-slate-deep/5 md:block">
              {rightItems.map((item) => (
                <MenuRow key={`${category.name}-${item.name}-${item.description ?? ''}-b`} item={item} />
              ))}
            </ul>
          </>
        ) : (
          <ul className="divide-y divide-slate-deep/5">
            {category.items.map((item) => (
              <MenuRow key={`${category.name}-${item.name}-${item.description ?? ''}`} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function MenuList({ categories }: MenuListProps) {
  const byName = Object.fromEntries(categories.map((category) => [category.name, category]));
  const isPermanentLayout = Boolean(byName.Pivo && byName.Víno && byName.Alkohol);
  const isSummerLayout = Boolean(byName.Drinky);

  if (isSummerLayout) {
    const rest = categories.filter((category) => category.name !== 'Drinky');

    return (
      <div className="space-y-8">
        <CategorySection category={byName.Drinky} itemColumns={2} />
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {rest.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))}
        </div>
      </div>
    );
  }

  if (!isPermanentLayout) {
    return (
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        {categories.map((category) => (
          <CategorySection key={category.name} category={category} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CategorySection category={byName.Pivo} itemColumns={2} />

      <CategorySection category={byName.Alkohol} itemColumns={2} />

      {byName['Nealkoholické nápoje'] && (
        <CategorySection category={byName['Nealkoholické nápoje']} itemColumns={2} />
      )}

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <CategorySection category={byName.Víno} />
        {byName['Káva a čaj'] && <CategorySection category={byName['Káva a čaj']} />}
      </div>

      {byName.Pochutiny && <CategorySection category={byName.Pochutiny} itemColumns={2} />}
    </div>
  );
}
