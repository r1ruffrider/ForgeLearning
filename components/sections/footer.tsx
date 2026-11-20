import { Logo } from "@/components/logo";
import { site } from "@/content/site";

const linkClass =
  "inline-flex min-h-11 items-center rounded-md px-2 text-[15px] text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-[15px] text-muted-foreground">
              {site.footer.tagline}
            </p>
            <p className="text-[15px] text-muted-foreground">
              {site.app.footerPrompt}{" "}
              <a
                href={site.app.url}
                className="inline-flex min-h-11 items-center rounded-md font-semibold text-forge-blue-soft underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {site.app.footerLoginLabel}
              </a>
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="-mx-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              {site.footer.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.brand.contactEmail}`} className={linkClass}>
                  {site.footer.contactLabel}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 font-mono text-xs leading-relaxed text-muted-foreground">
          {site.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
