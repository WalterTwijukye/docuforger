"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <>
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">description</span>
            <span className="text-xl font-bold tracking-tight">DocuForger</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Resources</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Log In</Link>
            <Link href="/signup" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                  New: AI-Powered Templates
                </span>
                <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-balance">
                  Automate Your Documents in <span className="text-primary">Seconds</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                  Stop manual copy-pasting. Generate professional PDFs and Word documents in under 30 seconds with our powerful automation engine.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="flex items-center justify-center bg-primary text-white text-lg font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                  Get Started for Free
                </Link>
                <button onClick={() => setShowVideoModal(true)} className="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-primary">play_circle</span>
                  See how it works
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt="User testimonial avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwglKMUxzGa69Vx2vvB6fdtrT93S0sPD_KDlfVl8alBVwJJDHpr5xJoOO82Tq1aWB4KE_MmfayhZUdxAVbUaYFnUmrH9LCMvKJABUdXnUi6l24l48YFHKym43-PxAvkQB4MNIjorXk8KASqvhWK3thg0JU28c-MQYdqi0k8c9iNaK8kPpc9qvRxdX51WjubjMrnj15rXcuPjsZANZ2FigkUWqVcPBlMKP23VUM-mvJH1mkqt6nQz6xp2GZBKKIcZpbWucqprWRgI02" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt="User testimonial avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8fAB_cxYtkUqpVXhakbTHcQUDOpeCYLj_mVnKh8rIVAwzqfYaFk9nGtExh52iTxDhbbiNLQ7DQo-m5IQgpQtj9_zWGxivBUXucoCK6aj1n1QGwFBXILKjDTpmacBqraXwJbC2HBkTFzeTMpjtM_Xr4VMk-avi38tUaF7fu1Q8yV2QRUW924JwxOdixparQ9IYzFlNKkx9yV5ps_D7FIenbGRZOGzKbLYg5lJTNmVtnrMKDglL91XdYzoYOhjs2RtzZ6kw3X4Qo6_N" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt="User testimonial avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClDhnUvw089R99iEIAYFg7lguwBdkG-rywVj91hefz1Uj0gZXeiM-iTB1aiAOm2ylPeJFcXItPGAJ10AVW5WJjMBCxxTQAK4WA7o2BgBKdBU7GM63u8_tlPMg7Cdscx1BumDGF7CwB9JwEuq75ODVyyc9NRl3GqjLE5lzWlLZnP6Zg7rlkv9CH0SfPxyqmvW-zn4UUmrZEkbDnnmETkHVky0H7um6MJjasFMaHwH9vgHPydNwl-TaPi1OwDZiBiM8N8J58RG4RHX97" />
                </div>
                <span>Trusted by 5,000+ companies worldwide</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl">
                <img className="w-full h-auto rounded-xl object-cover object-top" alt="DocuForger automatic document generation interface" src="/landing-page-1.png" />
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="bg-white dark:bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
                </div>
                <h3 className="text-xl font-bold">No Training Required</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our intuitive drag-and-drop interface is designed for humans. Get up and running in minutes, not days.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">article</span>
                </div>
                <h3 className="text-xl font-bold">Professional PDFs &amp; Word</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export high-fidelity documents that look perfect every time. Support for complex layouts and custom branding.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">shield</span>
                </div>
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Enterprise-grade SOC2 compliance and end-to-end encryption. Your sensitive data is always protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Powerful Features for Modern Teams</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to streamline your document workflow and eliminate repetitive manual tasks.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all">
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">dynamic_form</span>
                    Template Variables
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Create dynamic templates using simple tags like <code className="bg-primary/10 text-primary px-1 rounded">{`{{client_name}}`}</code> or <code className="bg-primary/10 text-primary px-1 rounded">{`{{invoice_total}}`}</code>.
                  </p>
                </div>
                <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all">
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit_note</span>
                    Easy Form Filling
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Turn any document into a smart form. Collect data from clients and automatically populate your templates without lifting a finger.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white">
                <img className="w-full h-auto aspect-video object-cover object-left-top" alt="Visual representation of document variables and form field mapping interface" src="/landing-page-2.png" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-white dark:bg-slate-900/50 px-6" id="pricing">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Simple, Transparent Pricing</h2>
              <p className="text-slate-600 dark:text-slate-400">Choose the plan that fits your growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
              {/* Free Plan */}
              <div className="flex flex-col p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    3 documents per month
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-lg">check_circle</span>
                    Standard templates
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-lg">check_circle</span>
                    Email support
                  </li>
                </ul>
                <Link href="/signup" className="flex items-center justify-center w-full py-3 rounded-lg font-bold border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Start for Free</Link>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col p-8 rounded-2xl border-2 border-primary bg-white dark:bg-slate-900 relative shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
                <h3 className="text-xl font-bold mb-2 text-primary">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$7</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Unlimited documents
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Priority email support
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Form filling automation
                  </li>
                </ul>
                <Link href="/signup?intent=pro" className="flex items-center justify-center w-full py-3 rounded-lg font-bold bg-primary text-white hover:opacity-90 transition-opacity">Go Pro</Link>
              </div>

              {/* Business Plan - Temporarily Disabled 
              <div className="flex flex-col p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
                <h3 className="text-xl font-bold mb-2">Business</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$29</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Team collaboration (5 seats)
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    API Access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Dedicated account manager
                  </li>
                </ul>
                <button className="w-full py-3 rounded-lg font-bold border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
              </div>
              */}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-6 text-center shadow-inner">
          <div className="mx-auto max-w-4xl bg-primary rounded-3xl p-12 md:p-20 text-white shadow-2xl shadow-primary/30">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Ready to reclaim your time?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have automated their document workflows with DocuForger.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="flex items-center justify-center bg-white text-primary text-lg font-bold px-10 py-4 rounded-xl hover:bg-slate-100 transition-colors">
                Start Free Trial
              </Link>
              <Link href="/signup" className="flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-colors">
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col items-center relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                src="/videoplayback (2).mp4"
              >
                Your browser does not support the video element.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Need assistance? Call us directly: <a href="tel:+256778512260" className="text-primary font-bold hover:underline">+256 778 512 260</a>
              </p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowContactModal(false); alert("Inquiry sent successfully!"); }}>
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Subject</label>
                  <input required placeholder="How can we help?" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">Body</label>
                  <textarea required rows={4} placeholder="Tell us more about your inquiry..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full py-3 mt-2 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark py-12 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">description</span>
              <span className="text-xl font-bold tracking-tight">DocuForger</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Modern document automation for high-growth teams. Spend less time formatting, and more time growing.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">Product</h5>
            <ul className="flex flex-col gap-3 text-sm text-slate-500">
              <li><Link className="hover:text-primary transition-colors" href="#features">Features</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#pricing">Pricing</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">Company</h5>
            <ul className="flex flex-col gap-3 text-sm text-slate-500">
              <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
              <li><button onClick={() => setShowContactModal(true)} className="hover:text-primary transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider">Legal</h5>
            <ul className="flex flex-col gap-3 text-sm text-slate-500">
              <li><Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} DocuForger. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
