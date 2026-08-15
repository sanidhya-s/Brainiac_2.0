'use client';
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen font-body-md selection:bg-primary selection:text-on-primary overflow-x-hidden">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-primary animate-pulse">data_exploration</span>
            <span className="font-headline-sm font-bold tracking-tight">Lumina Copilot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-label-lg text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block font-label-lg text-on-surface hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/dashboard" className="bg-primary text-on-primary font-label-lg px-6 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              Launch Copilot
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/50 text-label-lg text-primary">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Generative UI 2.0 is now live
          </div>
          
          <h1 className="font-display-lg text-5xl md:text-7xl font-bold tracking-tight text-on-surface leading-tight">
            Turn Raw Data into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Interactive Intelligence</span>
          </h1>
          
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Stop wrestling with spreadsheets. Upload your data, ask natural language questions, and instantly generate beautiful, interactive BI dashboards powered by Gemini AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto bg-primary text-on-primary font-title-md px-8 py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
              Get Started for Free
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <a href="#demo" className="w-full sm:w-auto bg-surface-container text-on-surface font-title-md px-8 py-4 rounded-full border border-outline-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">play_circle</span>
              Watch Demo
            </a>
          </div>
        </div>

        {/* Mockup Image */}
        <div className="max-w-[1200px] mx-auto mt-20 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-2xl pointer-events-none"></div>
          <div className="rounded-2xl border border-outline-variant/50 shadow-2xl bg-surface-container p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-tertiary/5 pointer-events-none"></div>
            <img 
              src="/dashboard.jpg" 
              alt="Lumina Copilot Dashboard Interface" 
              className="rounded-xl w-full object-cover border border-outline-variant/30 shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display-sm text-3xl md:text-5xl font-bold text-on-surface mb-4">Enterprise BI without the steep learning curve</h2>
            <p className="font-body-lg text-on-surface-variant text-lg max-w-2xl mx-auto">Everything you need to analyze, visualize, and share your data, built right into a simple chat interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-2 bg-surface-container rounded-3xl p-8 border border-outline-variant hover:border-primary/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-all duration-500"></div>
              <span className="material-symbols-outlined text-[48px] text-primary mb-6">chat_spark</span>
              <h3 className="font-headline-lg font-bold text-on-surface mb-3">Generative UI Architecture</h3>
              <p className="font-body-lg text-on-surface-variant max-w-md">
                Unlike traditional chatbots that just give text, Lumina dynamically generates actual React components (Charts, Datagrids, Metrics) in real-time based on your specific question.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant hover:border-tertiary/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px] -z-10 group-hover:bg-tertiary/20 transition-all duration-500"></div>
              <span className="material-symbols-outlined text-[48px] text-tertiary mb-6">picture_as_pdf</span>
              <h3 className="font-headline-md font-bold text-on-surface mb-3">Instant PDF Reports</h3>
              <p className="font-body-md text-on-surface-variant">
                Export your beautiful, interactive canvas into a sleek, presentation-ready PDF report with a single click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant hover:border-secondary/50 transition-colors relative overflow-hidden group">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-6">bolt</span>
              <h3 className="font-headline-md font-bold text-on-surface mb-3">Massive Data Parsing</h3>
              <p className="font-body-md text-on-surface-variant">
                Upload massive XLSX or CSV files. Our optimized frontend ArrayBuffer parsing processes data instantly without server delays.
              </p>
            </div>

            {/* Feature 4 (Large) */}
            <div className="md:col-span-2 bg-surface-container rounded-3xl p-8 border border-outline-variant hover:border-primary/50 transition-colors relative overflow-hidden group flex flex-col justify-end">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
              <div className="relative z-20">
                <span className="material-symbols-outlined text-[48px] text-primary mb-6">auto_graph</span>
                <h3 className="font-headline-lg font-bold text-on-surface mb-3">AI Data Aggregation</h3>
                <p className="font-body-lg text-on-surface-variant max-w-md">
                  Gemini mathematically calculates grouped sums, averages, and correlations automatically, passing the processed data directly into the charts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display-md text-4xl md:text-6xl font-bold text-on-surface">Ready to unlock your data?</h2>
          <p className="font-body-lg text-xl text-on-surface-variant">Join thousands of data-driven teams making smarter decisions with Generative AI.</p>
          <div className="pt-8">
            <Link href="/dashboard" className="bg-primary text-on-primary font-title-lg px-10 py-5 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 inline-flex group">
              Launch Lumina Copilot Free
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">rocket_launch</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant/30 py-12 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[24px] text-primary">data_exploration</span>
              <span className="font-title-md font-bold">Lumina</span>
            </div>
            <p className="font-body-sm text-on-surface-variant">Empowering teams with Generative UI business intelligence.</p>
          </div>
          <div>
            <h4 className="font-label-lg font-bold text-on-surface mb-4">Product</h4>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg font-bold text-on-surface mb-4">Resources</h4>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg font-bold text-on-surface mb-4">Legal</h4>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row items-center justify-between font-body-sm text-on-surface-variant">
          <p>© 2026 Lumina Copilot Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
