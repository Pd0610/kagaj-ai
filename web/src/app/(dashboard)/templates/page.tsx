"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Search,
  FileText,
  FileCheck,
  Receipt,
  Gavel,
  Scale,
  UserCheck,
  Crown,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  type Template,
  TemplateCategory,
  TemplateCategoryLabels,
} from "@/types/models";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";

// ── Category visual config ───────────────────────────────

interface CategoryConfig {
  icon: LucideIcon;
  bg: string;
  fg: string;
}

const categoryConfig: Record<TemplateCategory, CategoryConfig> = {
  [TemplateCategory.CompanyRegistration]: { icon: FileCheck, bg: "bg-primary-subtle", fg: "text-primary-subtle-fg" },
  [TemplateCategory.TaxCompliance]: { icon: Receipt, bg: "bg-warning-subtle", fg: "text-warning" },
  [TemplateCategory.BoardResolution]: { icon: Gavel, bg: "bg-info-subtle", fg: "text-info" },
  [TemplateCategory.LegalAgreement]: { icon: Scale, bg: "bg-success-subtle", fg: "text-success" },
  [TemplateCategory.HrDocument]: { icon: UserCheck, bg: "bg-destructive-subtle", fg: "text-destructive" },
  [TemplateCategory.General]: { icon: FileText, bg: "bg-secondary", fg: "text-secondary-foreground" },
};

const ALL_CATEGORIES = "all";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Template[]>("/templates");
      setTemplates(data);
    } catch {
      setError("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of templates) {
      counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    }
    return counts;
  }, [templates]);

  const availableCategories = useMemo(() => {
    return Object.values(TemplateCategory).filter((c) => categoryCounts.has(c));
  }, [categoryCounts]);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || t.category === activeCategory;
      const matchesSearch =
        search.length === 0 ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.name_ne && t.name_ne.includes(search)) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templates, activeCategory, search]);

  const isFiltering = search.length > 0 || activeCategory !== ALL_CATEGORIES;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a template to generate your document
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs
        defaultValue={ALL_CATEGORIES}
        onValueChange={(value) => setActiveCategory(value ?? ALL_CATEGORIES)}
      >
        <TabsList className="h-auto flex-wrap gap-1.5 p-1.5">
          <TabsTrigger value={ALL_CATEGORIES}>
            All ({templates.length})
          </TabsTrigger>
          {availableCategories.map((cat) => {
            const config = categoryConfig[cat];
            const CatIcon = config.icon;
            return (
              <TabsTrigger key={cat} value={cat}>
                <CatIcon className="h-3.5 w-3.5" />
                {TemplateCategoryLabels[cat]} ({categoryCounts.get(cat) ?? 0})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory}>
          {isFiltering && (
            <p className="mb-4 text-xs text-muted-foreground">
              Showing {filtered.length} of {templates.length} templates
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">
                No templates found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tmpl) => (
                <TemplateCard key={tmpl.id} template={tmpl} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const config = categoryConfig[template.category];
  const CatIcon = config.icon;
  const isLocked = template.is_locked;

  const handleClick = () => {
    if (!isLocked) {
      router.push(`/documents/new?template=${template.id}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={`relative transition-all duration-200 ${
        isLocked
          ? "opacity-60"
          : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
            <CatIcon className={`h-4 w-4 ${config.fg}`} />
          </div>
          <div className="flex items-center gap-1.5">
            {template.is_premium && (
              <Badge className="bg-gold text-gold-foreground text-xs">
                Pro
              </Badge>
            )}
            {isLocked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div>
          <h3 className="text-base font-semibold leading-tight">
            {template.name}
          </h3>
          {template.name_ne && (
            <p className="mt-0.5 text-sm leading-[1.7] text-muted-foreground">
              {template.name_ne}
            </p>
          )}
        </div>

        {template.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {template.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <Badge
            variant="secondary"
            className={`${config.bg} ${config.fg} border-transparent text-xs`}
          >
            {TemplateCategoryLabels[template.category]}
          </Badge>

          {isLocked && (
            <span className="flex items-center gap-1 text-xs text-gold-foreground">
              <Crown className="h-3 w-3" />
              Upgrade to Pro
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
