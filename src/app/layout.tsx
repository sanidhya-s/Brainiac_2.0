import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "AI BI Copilot",
  description: "Natural Language Business Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable}`} style={{ fontFamily: 'var(--font-inter), sans-serif', backgroundColor: 'var(--background)', color: 'var(--foreground)' }} suppressHydrationWarning>
        <nav style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--background)' }}>
          <div style={{ fontWeight: 600, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-foreground)', fontWeight: 'bold' }} className="shadow-accent">
              BI
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Acme Copilot</span>
          </div>
        </nav>
        <main className="container animate-fade-in" style={{ padding: '3rem 2rem', flex: 1, position: 'relative' }}>
          <div className="dot-pattern"></div>
          {children}
        </main>
      </body>
    </html>
  );
}
