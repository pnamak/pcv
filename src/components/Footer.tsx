import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-pcv-cream-dark bg-pcv-burgundy-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
            PCV
          </div>
          <p className="text-sm text-white/80">
            Presbyterian Church of Vanuatu — serving congregations across all
            islands with faith, fellowship, and mission.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link href="/churches" className="hover:text-white">
                Find Churches
              </Link>
            </li>
            <li>
              <Link href="/pastors" className="hover:text-white">
                Pastor Directory
              </Link>
            </li>
            <li>
              <Link href="/calendar" className="hover:text-white">
                Public Calendar
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-white">
                Media Releases
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Contact</h3>
          <p className="text-sm text-white/80">
            Presbyterian Church of Vanuatu
            <br />
            Port Vila, Vanuatu
            <br />
            <Link href="/contact" className="underline hover:text-white">
              Get in touch
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Presbyterian Church of Vanuatu
      </div>
    </footer>
  );
}
