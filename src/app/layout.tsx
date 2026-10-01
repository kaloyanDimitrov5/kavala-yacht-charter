import "./globals.css";

/**
 * Pass through root layout. The real <html> lives in app/[locale]/layout.tsx
 * so the lang attribute matches the route. app/not-found.tsx renders its own shell.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
