import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { getOwnerSitesFn } from "#/routes/owner/-lib/-server/get-owner-sites.function";
import { ownerKeys } from "#/routes/owner/-lib/owner-keys";
import { SiteAvatar } from "../../-components/site-avatar";
import { SiteActions } from "../-components/site-actions";

export const Route = createFileRoute("/owner/dashboard/sites/")({
    loader: ({ context }) =>
        context.queryClient.query({
            queryKey: ownerKeys.sites,
            queryFn: () => getOwnerSitesFn(),
            staleTime: 30_000,
        }),
    component: SitesPage,
});

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function SitesPage() {
    const ownedSites = Route.useLoaderData();
    return (
        <main className="grid w-full gap-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">Sites</h1>
                <Button asChild>
                    <Link to="/owner/sites/new">Create site</Link>
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
                {ownedSites.length ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="h-11 px-5 text-muted-foreground">Site</TableHead>
                                <TableHead className="h-11 px-5 text-right text-muted-foreground">Created</TableHead>
                                <TableHead className="w-14 px-3">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ownedSites.map((site) => (
                                <TableRow key={site.id} className="relative">
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <SiteAvatar name={site.name} />
                                            <div className="grid min-w-0">
                                                <Link
                                                    to="/owner/sites/$handle/dashboard"
                                                    params={{ handle: site.handle }}
                                                    target="_blank"
                                                    onClick={(event) => {
                                                        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
                                                            return;
                                                        }
                                                        event.preventDefault();
                                                        window.open(event.currentTarget.href, "_blank");
                                                    }}
                                                    className="truncate font-medium after:absolute after:inset-0"
                                                >
                                                    {site.name}
                                                </Link>
                                                {site.url && (
                                                    <a
                                                        href={site.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="relative w-fit max-w-full truncate text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                                    >
                                                        {site.url}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-right text-muted-foreground">
                                        {formatDate(site.createdAt)}
                                    </TableCell>
                                    <TableCell className="px-3 py-4 text-right">
                                        <SiteActions site={site} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="p-6 text-sm text-muted-foreground">You haven't created a site yet.</p>
                )}
            </div>
        </main>
    );
}
