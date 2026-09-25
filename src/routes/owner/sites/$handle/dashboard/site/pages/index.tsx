import { RiDeleteBinLine, RiMoreLine } from "@remixicon/react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { deleteOwnerPageFn, listOwnerPagesFn } from "#/lib/puck/page.function";
import { getOwnerSitesFn } from "#/routes/owner/-lib/-server/get-owner-sites.function";
import { ownerKeys } from "#/routes/owner/-lib/owner-keys";

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const Route = createFileRoute("/owner/sites/$handle/dashboard/site/pages/")({
    loader: async ({ context, params }) => {
        const sites = await context.queryClient.query({
            queryKey: ownerKeys.sites,
            queryFn: () => getOwnerSitesFn(),
            staleTime: 30_000,
        });
        const site = sites.find((s) => s.handle === params.handle);
        if (!site) {
            throw notFound();
        }

        const pages = await context.queryClient.query({
            queryKey: [...ownerKeys.sites, site.id, "pages"],
            queryFn: () => listOwnerPagesFn({ data: { siteId: site.id } }),
            staleTime: 30_000,
        });

        return { handle: params.handle, pages };
    },
    component: PagesPage,
});

function PagesPage() {
    const { handle, pages } = Route.useLoaderData();
    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);

    const toggleAll = (checked: boolean) => setSelected(checked ? new Set(pages.map((p) => p.id)) : new Set());
    const toggleOne = (id: string, checked: boolean) =>
        setSelected((prev) => {
            const next = new Set(prev);
            checked ? next.add(id) : next.delete(id);
            return next;
        });

    const deleteSelected = async () => {
        if (!window.confirm(`Delete ${selected.size} page${selected.size === 1 ? "" : "s"}? This can't be undone.`)) {
            return;
        }
        setDeleting(true);
        try {
            await Promise.all([...selected].map((pageId) => deleteOwnerPageFn({ data: { pageId } })));
            setSelected(new Set());
            await router.invalidate();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="grid w-full gap-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
                <Button asChild>
                    <Link to="/owner/sites/$handle/dashboard/site/pages/new" params={{ handle }}>
                        Add page
                    </Link>
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
                {pages.length ? (
                    <>
                        <div className="flex h-11 items-center justify-between gap-4 border-b px-5">
                            {selected.size > 0 ? (
                                <>
                                    <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" disabled={deleting} aria-label="Bulk actions">
                                                <RiMoreLine />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem variant="destructive" onSelect={deleteSelected}>
                                                <RiDeleteBinLine />
                                                Delete pages
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    {pages.length} page{pages.length === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-11 w-10 px-5">
                                        <Checkbox
                                            checked={selected.size === pages.length ? true : selected.size > 0 ? "indeterminate" : false}
                                            onCheckedChange={(checked) => toggleAll(checked === true)}
                                            aria-label="Select all pages"
                                        />
                                    </TableHead>
                                    <TableHead className="h-11 px-5 text-muted-foreground">Title</TableHead>
                                    <TableHead className="h-11 px-5 text-muted-foreground">Path</TableHead>
                                    <TableHead className="h-11 px-5 text-right text-muted-foreground">Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((p) => (
                                    <TableRow key={p.id} className="relative">
                                        <TableCell className="relative z-10 px-5 py-4">
                                            <Checkbox
                                                checked={selected.has(p.id)}
                                                onCheckedChange={(checked) => toggleOne(p.id, checked === true)}
                                                aria-label={`Select ${p.title}`}
                                            />
                                        </TableCell>
                                        <TableCell className="px-5 py-4 font-medium">
                                            <Link
                                                to="/owner/sites/$handle/dashboard/site/pages/$pageId"
                                                params={{ handle, pageId: p.id }}
                                                className="after:absolute after:inset-0"
                                            >
                                                {p.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-muted-foreground">{p.path}</TableCell>
                                        <TableCell className="px-5 py-4 text-right text-muted-foreground">
                                            {formatDate(p.updatedAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <p className="p-6 text-sm text-muted-foreground">No pages yet.</p>
                )}
            </div>
        </main>
    );
}
