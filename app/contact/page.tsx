import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us - TuklasVerse",
  description: "Get in touch with the TuklasVerse team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
        Contact Us
      </h1>
      <p className="text-white/60 leading-relaxed mb-10">
        Got a question, found a bug, or have a suggestion? We&apos;d love to
        hear from you.
      </p>

      <div className="space-y-4">
        <Link
          href="mailto:hello@tuklasverse.app"
          className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
              Email
            </h3>
            <p className="text-sm text-white/50">hello@tuklasverse.app</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
            <MessageCircle size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Response time</h3>
            <p className="text-sm text-white/50">
              We typically reply within 2–3 business days.
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-white/40 mt-10">
        For copyright-related concerns, please refer to our{" "}
        <Link href="/dmca" className="text-violet-400 hover:text-violet-300 underline">
          DMCA Policy
        </Link>{" "}
        instead of the general contact above — it&apos;ll get to the right
        place faster.
      </p>
    </div>
  );
}