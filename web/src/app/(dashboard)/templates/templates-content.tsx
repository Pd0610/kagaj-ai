"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type PaginatedEnvelope } from "@/lib/api-client";
import type { Template } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4">
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeCategory === null ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.slug}
            variant={activeCategory === cat.slug ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.name} ({cat.templates_count})
          </Badge>
        ))}
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <FileTextIcon className="mb-2 size-8" />
          <p>No templates found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link key={t.slug} href={`/templates/${t.slug}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{t.category}</Badge>
                    {t.is_free_eligible && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Free
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>{t.name_ne}</CardDescription>
                </CardHeader>
                {t.description && (
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {t.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
