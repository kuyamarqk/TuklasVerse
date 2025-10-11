import Link from 'next/link';

export default function Section({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full max-w-screen-xl mx-auto mb-8">
      <div className="flex items-center justify-between px-4 sm:px-0 mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-[#FFAB91] hover:underline transition"
          >
            View More →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
