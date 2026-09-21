import { RiDeleteBinLine, RiMoreLine } from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { deleteSiteFn } from "../../-lib/-server/delete-site.function";
import { ownerKeys } from "../../-lib/owner-keys";

export function SiteActions({ site }: { site: { id: string; name: string } }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [pending, setPending] = useState(false);

    const onDelete = async () => {
        if (!window.confirm(`Delete "${site.name}"? This can't be undone.`)) {
            return;
        }
        setPending(true);
        try {
            await deleteSiteFn({ data: { siteId: site.id } });
            await queryClient.invalidateQueries({ queryKey: ownerKeys.sites });
            await router.invalidate();
        } finally {
            setPending(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" disabled={pending} aria-label="Site options">
                    <RiMoreLine />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                    <RiDeleteBinLine />
                    Delete site
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
