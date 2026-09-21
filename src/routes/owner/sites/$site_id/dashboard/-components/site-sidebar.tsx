import { RiArrowLeftLine, RiDashboardLine, RiExternalLinkLine } from "@remixicon/react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "#/components/ui/sidebar";

type SiteSidebarProps = {
    site: { id: string; name: string; url: string | null };
};

export default function SiteSidebar({ site }: SiteSidebarProps) {
    const router = useRouter();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const overviewActive = pathname.replace(/\/$/, "") === `/owner/sites/${site.id}/dashboard`;

    return (
        <Sidebar>
            <SidebarHeader>
                <Button variant="ghost" size="sm" className="w-fit" asChild>
                    <Link
                        to="/owner/dashboard/sites"
                        onClick={(event) => {
                            if (window.opener && !window.opener.closed) {
                                event.preventDefault();
                                window.opener.focus();
                                window.close();
                                setTimeout(() => router.navigate({ to: "/owner/dashboard/sites" }), 100);
                            }
                        }}
                    >
                        <RiArrowLeftLine />
                        All sites
                    </Link>
                </Button>
                <span className="truncate px-2 py-1 text-base font-semibold">{site.name}</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Site</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={overviewActive}>
                                    <Link to="/owner/sites/$site_id/dashboard" params={{ site_id: site.id }}>
                                        <RiDashboardLine />
                                        Overview
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {site.url && (
                <SidebarFooter>
                    <Button variant="outline" asChild>
                        <a href={site.url} target="_blank" rel="noreferrer">
                            Visit site
                            <RiExternalLinkLine />
                        </a>
                    </Button>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}
