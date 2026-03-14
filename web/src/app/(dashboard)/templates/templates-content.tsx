"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type PaginatedEnvelope } from "@/lib/api-client";
import type { Template } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileTextIcon, SearchIcon } from "lucide-react";

interface Category {
  slug: string;
  name: string;
  templates_count: number;
}

export function TemplatesContent() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void api.get<Category[]>("/templates/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (search) params.set("search", search);
    const query = params.toString();

    const controller = new AbortController();

    void (async () => {
      try {
        const res = await api.get<Template[]>(
          `/templates${query ? `?${query}` : ""}`,
        );
        if (!cancelled) {
          const envelope = res as unknown as PaginatedEnvelope<Template>;
          setTemplates(envelope.data);
        }
      } catch {
        // ignore aborted requests
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeCategory, search]);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`category-pill ${
            activeCategory === null
              ? "category-pill-active"
              : "category-pill-inactive"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`category-pill ${
              activeCategory === cat.slug
                ? "category-pill-active"
                : "category-pill-inactive"
            }`}
          >
            {cat.name} ({cat.templates_count})
          </button>
        ))}
      </div>

      {/* Template grid */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-muted-foreground">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted mb-3">
            <FileTextIcon className="size-6" />
          </div>
          <p className="font-medium">No templates found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link key={t.slug} href={`/templates/${t.slug}`}>
              <div className="card-hover rounded-xl p-5 h-full flex flex-col">
                {/* Badges row */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {t.category}
                  </Badge>
                  {t.is_free_eligible && (
                    <Badge
                      variant="secondary"
                      className="bg-accent text-accent-foreground border-0"
                    >
                      Free
                    </Badge>
                  )}
                </div>

                {/* Title & Nepali name */}
                <p className="font-semibold text-sm leading-snug">
                  {t.name}
                </p>
                {t.name_ne && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.name_ne}
                  </p>
                )}

                {/* Description */}
                {t.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground mt-3 flex-1">
                    {t.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
