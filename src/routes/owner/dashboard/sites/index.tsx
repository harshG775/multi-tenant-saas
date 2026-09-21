import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { getOwnerSitesFn } from "#/routes/owner/-lib/-server/get-owner-sites.function";
import { ownerKeys } from "#/routes/owner/-lib/owner-keys";

export const Route = createFileRoute("/owner/dashboard/sites/")({
    loader: ({ context }) =>
        context.queryClient.query({
            queryKey: ownerKeys.sites,
            queryFn: () => getOwnerSitesFn(),
            staleTime: 30_000,
        }),
    component: SitesPage,
});

function SitesPage() {
    const ownedSites = Route.useLoaderData();
    return (
        <main className="flex-1">
            <div className="flex justify-between">
                <h1>Sites</h1>
            </div>
            <div>
                {ownedSites.length ? (
                    <ul className="grid gap-2 text-sm">
                        {ownedSites.map((site) => (
                            <Link
                                key={site.id}
                                to="/owner/sites/$site_id/dashboard"
                                params={{
                                    site_id: site.id,
                                }}
                            >
                                <span className="font-medium">{site.name}</span>{" "}
                                {site.url && (
                                    <div className="text-secondary-foreground underline-offset-4 underline">
                                        {site.url}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <div className="grid gap-4">
                        <p className="text-sm text-muted-foreground">You haven't created a site yet.</p>
                        <Button asChild>
                            <Link to="/owner/sites/new">Create your site</Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
