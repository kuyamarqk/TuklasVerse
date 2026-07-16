// component/Footer.tsx
import Link from "next/link";
import { Mail } from "lucide-react";
import SupportCard from "@/component/SupportCard";

const footerLinks = {
  Browse: [
    { href: "/movie", label: "Movies" },
    { href: "/tv", label: "TV Series" },
    { href: "/search", label: "Search" },
    { href: "/watchlist", label: "My List" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/dmca", label: "DMCA" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              TuklasVerse
            </span>
            <p className="mt-3 text-xs text-white/40 leading-relaxed max-w-xs">
              Your personal media universe. Discover, track, and stream movies and TV series in one place.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Link
                href="https://github.com/kuyamarqk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </Link>

              <Link
                href="https://x.com/kuyamarqk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                </svg>
              </Link>
              <Link
                href="https://www.threads.com/@kuyamarqk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 192 192" fill="currentColor">
                  <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1-.104 0-.207 0-.311 0-15.01 0-27.499 6.415-35.212 18.09l13.905 9.529c5.752-8.729 14.776-10.591 21.324-10.591.078 0 .156 0 .234 0 8.15.052 14.31 2.416 18.313 7.028 2.917 3.356 4.868 7.998 5.83 13.858-7.281-1.238-15.177-1.62-23.611-1.14-23.744 1.352-39.005 15.171-37.976 34.396.522 9.759 5.377 18.153 13.674 23.641 7.012 4.639 16.043 6.913 25.436 6.399 12.418-.682 22.166-5.462 28.985-14.209 5.181-6.653 8.458-15.267 9.906-26.108 5.943 3.583 10.34 8.298 12.767 13.95 4.132 9.605 4.373 25.386-8.44 38.196-11.229 11.226-24.72 16.075-45.098 16.222-22.6-.166-39.685-7.416-50.775-21.549-10.39-13.24-15.759-32.34-15.958-56.767.199-24.428 5.568-43.528 15.958-56.767 11.09-14.133 28.175-21.383 50.775-21.549 22.76.166 40.144 7.45 51.669 21.652 5.658 6.976 9.923 15.744 12.755 25.951l17.436-4.649c-3.421-12.577-8.816-23.412-16.131-32.428C160.4 8.79 137.643-.166 111.396 0h-.024C85.169-.166 62.638 8.812 45.813 30.043 30.837 48.949 23.108 74.34 22.876 95.94v.12c.232 21.6 7.961 46.991 22.937 65.897C62.638 183.188 85.169 192.166 111.372 192h.024c25.06-.166 42.775-6.674 57.383-21.243 19.196-19.181 18.634-43.221 12.315-58.019-4.529-10.532-13.163-19.077-24.557-24.75Zm-42.339 45.362c-10.386.578-21.184-4.09-21.717-14.101-.394-7.406 5.281-15.665 22.34-16.646 1.955-.112 3.875-.167 5.76-.167 6.199 0 12.005.6 17.284 1.75-1.968 24.611-13.487 28.564-23.667 29.164Z"/>
                </svg>
              </Link>

              <Link
                href="mailto:kuyamarqk@gmail.com"
                aria-label="Email"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Mail size={15} />
              </Link>
            </div>

            <div className="mt-4">
              <SupportCard variant="compact" />
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 text-center sm:text-left">
            {"\u00A9"} {year} TuklasVerse. All rights reserved.
          </p>
          <p className="text-xs text-white/30 text-center sm:text-right max-w-md">
            TuklasVerse does not host any files. All content is provided by third-party services.
          </p>
        </div>
      </div>
    </footer>
  );
}