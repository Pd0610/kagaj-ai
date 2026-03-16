"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ApiError } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileText, Building2, Languages } from "lucide-react";

const benefits = [
  { icon: FileText, text: "5 free documents every month" },
  { icon: Building2, text: "20+ legally verified templates" },
  { icon: Languages, text: "Perfect bilingual PDF output" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      await register(name, email, password);
      router.push("/companies");
    } catch (err) {
      if (err instanceof ApiError && err.envelope.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(err.envelope.errors)) {
          const msg = messages as string[];
          if (msg[0]) fieldErrors[key] = msg[0];
        }
        setErrors(fieldErrors);
      } else if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-md shadow-neutral-900/5">
      {/* Header */}
      <div className="text-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          Kagaj<span className="text-gold">AI</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
          Create your free account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start generating documents in minutes
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-5 rounded-lg bg-primary-subtle/50 p-4">
        <div className="flex flex-col gap-2.5">
          {benefits.map((benefit) => (
            <div
              key={benefit.text}
              className="flex items-center gap-2.5 text-sm font-medium text-primary-subtle-fg"
            >
              <benefit.icon className="h-4 w-4 shrink-0 text-primary" />
              {benefit.text}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-6">
        {errors.form && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg bg-destructive-subtle p-3"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{errors.form}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" />
            {errors.name && (
              <p className="text-xs text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              placeholder="Minimum 8 characters"
            />
            {errors.password && (
              <p className="text-xs text-destructive" role="alert">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="mt-6 h-10 w-full text-[15px] font-semibold transition-colors duration-150 hover:bg-primary-hover"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create free account"}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          No credit card required
        </p>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors duration-150 hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
