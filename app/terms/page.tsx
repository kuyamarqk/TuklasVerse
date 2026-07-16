import Link from "next/link";

export const metadata = {
  title: "Terms of Service - TuklasVerse",
  description: "Terms and conditions for using TuklasVerse.",
};

export default function TermsPage() {
  const lastUpdated = "July 16, 2026";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-white/40 mb-10">Last updated: {lastUpdated}</p>

      <div className="space-y-8 text-white/60 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TuklasVerse (&ldquo;the Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Description of Service</h2>
          <p>
            TuklasVerse is a media discovery platform that displays movie and
            TV show information sourced from third-party metadata providers,
            and links to or embeds third-party video streaming sources.
            TuklasVerse does not host, upload, or store any video files on
            its own infrastructure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Third-Party Content</h2>
          <p>
            Video playback is provided through embedded third-party services
            not owned or operated by TuklasVerse. We do not control, endorse,
            or take responsibility for the availability, legality, or quality
            of content provided by these third parties. Use of such embedded
            content is at your own discretion and risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity under your account. You
            must provide accurate information when creating an account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Acceptable Use</h2>
          <p>
            You agree not to misuse the Service, including but not limited to
            attempting unauthorized access to systems, scraping content at
            scale, or using the Service for any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Intellectual Property</h2>
          <p>
            Movie and TV metadata, including titles, descriptions, and
            images, are the property of their respective owners and are
            displayed under license or fair use from providers such as TMDB.
            The TuklasVerse name, logo, and original design elements are the
            property of TuklasVerse.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of
            any kind, express or implied. We do not guarantee uninterrupted,
            error-free, or secure access to the Service at all times.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, TuklasVerse shall not be
            liable for any indirect, incidental, or consequential damages
            arising from your use of the Service or any third-party content
            accessed through it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">9. Changes to These Terms</h2>
          <p>
            We may revise these Terms at any time. Continued use of the
            Service after changes take effect constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">10. Contact</h2>
          <p>
            Questions about these Terms? Reach us via our{" "}
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