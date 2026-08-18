import Link from "next/link";
import { pillarByKey } from "@/lib/taxonomy";

export function QuickNavCarousel({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center gap-3">
        {categories.map((cat) => {
          const pillar = pillarByKey(cat.pillar);
          if (!pillar) return null;
          return (
            <Link
              key={cat.id}
              href={`/${pillar.slug}/${cat.slug}`}
              className="flex-shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium tracking-wide text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
