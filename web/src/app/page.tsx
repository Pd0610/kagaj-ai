import Link from "next/link";
import {
  FileText,
  Building2,
  Shield,
  Zap,
  Clock,
  Languages,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ScrollLink } from "@/components/scroll-link";

function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          Kagaj<span className="text-gold">AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ScrollLink
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Features
          </ScrollLink>
          <ScrollLink
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            How it Works
          </ScrollLink>
          <ScrollLink
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Pricing
          </ScrollLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-0 -z-10 h-72 w-72 rounded-full bg-primary-subtle opacity-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-56 w-56 rounded-full bg-gold/10 opacity-50 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-sm font-medium text-gold-foreground">
          <Sparkles className="h-4 w-4 text-gold" />
          AI-Powered Document Generation
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.15] font-bold tracking-[-0.025em] text-foreground md:text-[3.5rem]">
          Government Documents,{" "}
          <span className="text-primary">Done Right</span>
          <br />
          <span className="text-primary">in Minutes</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Generate legally accurate Nepali government documents for your
          company. Board resolutions, tax forms, legal agreements — all with
          correct formatting and bilingual support.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25"
          >
            Start Free — No Credit Card
            <ArrowRight className="h-4 w-4" />
          </Link>
          <ScrollLink
            href="#how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-card px-8 text-base font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            See How it Works
          </ScrollLink>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Free plan includes 5 documents/month. No credit card required.
        </p>
      </div>
    </section>
  );
}

const problems = [
  {
    icon: Clock,
    title: "Hours on Each Document",
    description:
      "CA firms spend 30-60 minutes per document, manually formatting in Word with constant copy-paste errors.",
  },
  {
    icon: Languages,
    title: "Bilingual Formatting Nightmares",
    description:
      "Nepali-English documents break constantly — wrong fonts, misaligned fields, broken conjuncts in print.",
  },
  {
    icon: Shield,
    title: "Compliance Anxiety",
    description:
      "Missing fields, wrong formats, outdated templates — one mistake means rejection at the OCR office.",
  },
];

function ProblemSection() {
  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            The Problem
          </p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-[-0.02em] text-foreground md:text-[2rem]">
            Document Generation Shouldn&apos;t Be This Painful
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-destructive-subtle">
                <item.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: FileText,
    title: "20+ Legal Templates",
    description:
      "Board resolutions, tax clearance, company registration, employment agreements — all OCR-compliant formats.",
  },
  {
    icon: Building2,
    title: "Company Data Auto-Fill",
    description:
      "Enter your company details once. Every document auto-fills name, PAN, registration number, and address.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Drafting",
    description:
      "Describe what you need in plain language. AI fills the correct legal fields with proper Nepali terminology.",
  },
  {
    icon: Languages,
    title: "Perfect Bilingual Output",
    description:
      "Nepali and English rendered correctly — proper Devanagari conjuncts, official formatting, print-ready PDF.",
  },
  {
    icon: Shield,
    title: "OCR-Compliant Formats",
    description:
      "Every template follows Office of Company Registration standards. Accepted on first submission.",
  },
  {
    icon: Zap,
    title: "2 Minutes, Not 2 Hours",
    description:
      "Select template, fill fields, download PDF. What used to take an hour now takes minutes.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Features
          </p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-[-0.02em] text-foreground md:text-[2rem]">
            Everything Your CA Firm Needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Built specifically for Nepali businesses and CA firms. Every feature
            designed around how documents actually work in Nepal.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-subtle">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Add Your Company",
    description:
      "Enter company details once — name, PAN, registration number. This data auto-fills every future document.",
  },
  {
    number: "02",
    title: "Choose a Template",
    description:
      "Pick from 20+ legally verified templates. Board resolutions, tax forms, agreements — all OCR-compliant.",
  },
  {
    number: "03",
    title: "Generate & Download",
    description:
      "Fill the remaining fields (or let AI draft it). Download a print-ready PDF with perfect bilingual formatting.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border bg-card py-20"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            How it Works
          </p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-[-0.02em] text-foreground md:text-[2rem]">
            Three Steps to Your Document
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free",
    price: "0",
    description: "For individuals getting started",
    features: [
      "5 documents per month",
      "1 company profile",
      "Free templates only",
      "PDF download",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "999",
    description: "For CA firms and businesses",
    features: [
      "Unlimited documents",
      "Unlimited companies",
      "All premium templates",
      "AI-powered drafting",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large firms and organizations",
    features: [
      "Everything in Pro",
      "Custom templates",
      "Team management",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Us",
    href: "/register",
    highlighted: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Pricing
          </p>
          <h2 className="mt-3 text-[1.75rem] font-bold tracking-[-0.02em] text-foreground md:text-[2rem]">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 transition-all duration-200 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/20 hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 right-6 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-gold-foreground">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6">
                {plan.price === "Custom" ? (
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    Custom
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">NPR</span>
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex h-10 w-full items-center justify-center rounded-md text-sm font-semibold transition-colors duration-150 ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-t border-border bg-primary py-20">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-primary-foreground md:text-[2rem]">
          Stop Wasting Hours on Document Formatting
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
          Join CA firms across Nepal who generate legally accurate documents in
          minutes, not hours.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-card px-8 text-base font-semibold text-primary shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-primary"
            >
              Kagaj<span className="text-gold">AI</span>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-powered document generation for Nepal
            </p>
          </div>

          <div className="flex gap-8">
            <ScrollLink
              href="#features"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Features
            </ScrollLink>
            <ScrollLink
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Pricing
            </ScrollLink>
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} KagajAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
