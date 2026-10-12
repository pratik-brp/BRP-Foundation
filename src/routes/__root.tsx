import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BrandPreloader } from "@/components/BrandPreloader";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--background, #fbfbf9)",
        color: "var(--foreground, #0c2340)",
        fontFamily: "var(--font-body, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "480px", textAlign: "center" }}>
        <img
          src="/brp-logo.png"
          alt="BRP Foundation Logo"
          style={{ width: "72px", height: "72px", margin: "0 auto 24px", display: "block" }}
        />
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.14em",
            fontWeight: 700,
            color: "#206337",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          404 Error
        </p>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1,
            color: "#0c2340",
            margin: "0 0 16px",
            fontFamily: "var(--font-display, sans-serif)",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0c2340",
            margin: "0 0 12px",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#52637a",
            margin: "0 0 28px",
          }}
        >
          The page you are looking for is currently unavailable or has been moved.
        </p>
        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#206337",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(32, 99, 55, 0.25)",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BRP Foundation — Building Stronger Communities, Creating Brighter Futures" },
      { name: "description", content: "BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development in Nepal." },
      { name: "author", content: "BRP Foundation" },
      { property: "og:title", content: "BRP Foundation" },
      { property: "og:description", content: "Building stronger communities. Creating brighter futures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/brp-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Rendered in the shell, so it plays once per full page load and never on in-app navigation */}
        <BrandPreloader />
        <noscript>
          <style>{".brand-preloader{display:none}"}</style>
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export const DEMO_404_LOCK = false; // When true, all other routes show 404 Page Not Found

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  if (DEMO_404_LOCK && location.pathname !== "/" && location.pathname !== "/about") {
    return <NotFoundComponent />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
