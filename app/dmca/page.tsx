import Link from "next/link";

export const metadata = {
  title: "DMCA Policy - TuklasVerse",
  description: "Copyright infringement notice and takedown procedure for TuklasVerse.",
};

export default function DmcaPage() {
  const lastUpdated = "July 16, 2026";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
        DMCA Policy
      </h1>
      <p className="text-sm text-white/40 mb-10">Last updated: {lastUpdated}</p>

      <div className="space-y-8 text-white/60 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">1. No Hosted Content</h2>
          <p>
            TuklasVerse does not host, upload, store, or distribute any video
            files on its own servers. The Service displays publicly available
            movie and TV metadata and embeds video players hosted by
            independent third-party providers. TuklasVerse has no ability to
            remove content from those third-party servers directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">2. Reporting Infringing Metadata</h2>
          <p>
            If you believe that metadata displayed on TuklasVerse (such as a
            poster image, title, or description) infringes your copyright,
            and it originates from our metadata provider, please note this
            content is sourced from{" "}
            <Link
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline"
            >
              The Movie Database (TMDB)
            </Link>
            . We recommend filing a report directly with TMDB as well as
            notifying us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">3. Reporting Third-Party Streaming Content</h2>
          <p>
            If you believe a specific embedded streaming source is
            distributing content that infringes your copyright, that source
            is operated independently by a third party. We encourage rights
            holders to submit takedown requests directly to the third-party
            provider hosting the actual video file, as TuklasVerse does not
            control or store that content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">4. Submitting a Notice to Us</h2>
          <p>
            If you&apos;d still like to notify TuklasVerse of a concern (for
            example, to request we remove a link or embed pointing to
            infringing material), please include the following information
            when contacting us:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-white/50">
            <li>Identification of the copyrighted work you claim has been infringed</li>
            <li>The specific URL(s) on TuklasVerse where the material appears</li>
            <li>Your contact information (name, email, and address)</li>
            <li>
              A statement that you have a good-faith belief the use is
              unauthorized
            </li>
            <li>
              A statement, under penalty of perjury, that the information
              provided is accurate and that you are authorized to act on
              behalf of the copyright owner
            </li>
            <li>Your physical or electronic signature</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">5. Our Response</h2>
          <p>
            Upon receiving a valid notice, we will review the request and,
            where applicable, remove or disable links to the reported content
            on our platform within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">6. Contact</h2>
          <p>
            Submit copyright concerns through our{" "}
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