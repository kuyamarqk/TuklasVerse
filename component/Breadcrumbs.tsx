// component/Breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string; // omit href on the last (current) item
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-white/40">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-white/70 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-white/70" : ""}>{item.label}</span>
              )}
              {!isLast && <ChevronRight size={12} className="text-white/20" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}