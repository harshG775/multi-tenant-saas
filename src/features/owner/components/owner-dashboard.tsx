import { useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { ownerAuthClient } from "../auth-client";
import { OwnerCard } from "./owner-card";

type OwnerDashboardProps = {
    ownerName: string;
    siteName: string;
    siteUrl: string;
};

export function OwnerDashboard({ ownerName, siteName, siteUrl }: OwnerDashboardProps) {
    const router = useRouter();

    const onSignOut = async () => {
        await ownerAuthClient.signOut();
        await router.navigate({ to: "/owner/login" });
    };

    return (
        <OwnerCard title={siteName} description={`Signed in as ${ownerName}.`}>
            <div className="grid gap-4">
                <p className="text-sm">
                    Your site is live at{" "}
                    <a href={siteUrl} className="text-primary underline-offset-4 hover:underline">
                        {siteUrl}
                    </a>
                </p>
                <Button variant="outline" onClick={onSignOut}>
                    Sign out
                </Button>
            </div>
        </OwnerCard>
    );
}
