import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - TuklasVerse",
  description: "Learn how TuklasVerse collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  const lastUpdated = "July 16, 2026";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-white/40 mb-10">Last updated: {lastUpdated}</p>

      <div className="space-y-8 text-white/60 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your email address and
            authentication details through our authentication provider. When
            you use features like watchlists or watch history, we store the
            titles you interact with, associated with your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. How We Use Your Information</h2>
          <p>
            We use collected information to operate core features of the
            service — such as your personal watchlist, watch history, and
            account authentication — and to improve the overall experience of
            the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Third-Party Services</h2>
          <p>
            TuklasVerse uses third-party services to operate, including but
            not limited to authentication and database infrastructure, movie
            and TV metadata providers, and embedded video streaming providers.
            These third parties may independently collect information (such
            as IP address or device data) when you interact with their
            embedded content. We do not control and are not responsible for
            the privacy practices of these third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Cookies</h2>
          <p>
            We use cookies and similar technologies to keep you signed in and
            to remember basic preferences. Third-party embeds may also set
            their own cookies, which are governed by their respective privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Data Retention</h2>
          <p>
            Your account data, watchlist, and watch history are retained
            until you delete your account or request removal. You may request
            deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by reaching out through our{" "}
            <Link href="/contact" className="text-violet-400 hover:text-violet-300 underline">
              Contact page
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued
            use of TuklasVerse after changes are posted constitutes acceptance
            of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">8. Contact</h2>
          <p>
            Questions about this policy? Reach us via our{" "}
            <Link href="/contact" className="text-violet-400 hover:text-violet-300 underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}