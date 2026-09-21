import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { ownerAuthClient } from "#/lib/auth/owner-client";
import { ownerStateKey } from "../-functions/owner-state.function";
import { OwnerCard } from "./owner-card";

type OwnerDashboardProps = {
    ownerName: string;
    site: { name: string; url: string } | null;
};

export function OwnerDashboard({ ownerName, site }: OwnerDashboardProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const onSignOut = async () => {
        await ownerAuthClient.signOut();
        await queryClient.invalidateQueries({ queryKey: ownerStateKey });
        await router.navigate({ to: "/owner/signin" });
    };

    return (
        <OwnerCard title={site?.name ?? "Dashboard"} description={`Signed in as ${ownerName}.`}>
            <div className="grid gap-4">
                {site ? (
                    <p className="text-sm">
                        Your site is live at{" "}
                        <a href={site.url} className="text-primary underline-offset-4 hover:underline">
                            {site.url}
                        </a>
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">You haven't created a site yet.</p>
                        <Button asChild>
                            <Link to="/owner/onboarding">Create your site</Link>
                        </Button>
                    </>
                )}
                <Button variant="outline" onClick={onSignOut}>
                    Sign out
                </Button>
            </div>
        </OwnerCard>
    );
}
