'use client';

import { useState } from 'react';
import MenuList from '@/components/MenuList';
import { permanentDrinksMenu, summerDrinksMenu } from '@/lib/data';

type Tab = 'permanent' | 'summer';

const tabs: { id: Tab; label: string }[] = [
  { id: 'permanent', label: 'Stálá nápojová nabídka' },
  { id: 'summer', label: 'Letní nápojová nabídka' },
];

const menuData = {
  permanent: permanentDrinksMenu,
  summer: summerDrinksMenu,
};

export default function DrinkMenuTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('permanent');

  return (
    <div>
      <div
        className="mb-8 flex flex-col gap-2 rounded-2xl bg-white p-1.5 shadow-sm sm:flex-row"
        role="tablist"
        aria-label="Nápojové menu"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-forest text-ivory shadow-sm'
                : 'text-slate-deep/60 hover:bg-forest/5 hover:text-forest'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === 'summer' && (
          <p className="mb-6 text-sm text-slate-deep/60">
            Sezónní nabídka platí v letních měsících. Konkréní položky se mohou lišit dle aktuální nabídky.
          </p>
        )}
        <MenuList categories={menuData[activeTab]} />
      </div>
    </div>
  );
}
