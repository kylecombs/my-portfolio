import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { PageLayout } from "./components/Layout";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Grotesk:wght@700&display=swap",
  },
  { rel: "preconnect", href: "https://cdn.fonts.net" },
  {
    rel: "stylesheet",
    href: "https://cdn.fonts.net/kit/a58d2694-5d95-41b8-83fc-d7c00f1d830f/a58d2694-5d95-41b8-83fc-d7c00f1d830f_enhanced.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="text/javascript"
          src="https://cdn.fonts.net/kit/a58d2694-5d95-41b8-83fc-d7c00f1d830f/a58d2694-5d95-41b8-83fc-d7c00f1d830f_enhanced.js"
          async
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
