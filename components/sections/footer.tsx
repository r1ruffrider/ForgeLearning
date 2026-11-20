import { Logo } from "@/components/logo";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {site.footer.tagline}
            </p>
            <p className="text-sm text-muted-foreground">
              {site.app.footerPrompt}{" "}
              <a
                href={site.app.url}
                className="rounded-md font-semibold text-forge-blue-soft underline-offset-4 transition-colors duration-200 ease-out hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {site.app.footerLoginLabel}
              </a>
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-col items-center gap-3 sm:items-end"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {site.footer.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.brand.contactEmail}`}
                  className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {site.footer.contactLabel}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/70 sm:text-left">
          {site.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
