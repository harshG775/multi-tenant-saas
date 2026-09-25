import { RiArrowLeftLine, RiDashboardLine } from "@remixicon/react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "#/components/ui/sidebar";
import { SiteAvatar } from "#/routes/owner/-components/site-avatar";

type SiteSidebarProps = {
    site: { handle: string; name: string; url: string };
};

export default function SiteSidebar({ site }: SiteSidebarProps) {
    const router = useRouter();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const overviewActive = pathname.replace(/\/$/, "") === `/owner/sites/${site.handle}/dashboard`;

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
                <div className="flex items-center gap-3 px-2 py-1">
                    <SiteAvatar name={site.name} />
                    <div className="grid min-w-0">
                        <span className="truncate text-base font-semibold">{site.name}</span>
                        {site.url && (
                            <a
                                href={site.url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {site.url.replace(/^https?:\/\//, "")}
                            </a>
                        )}
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Site</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={overviewActive}>
                                    <Link to="/owner/sites/$handle/dashboard" params={{ handle: site.handle }}>
                                        <RiDashboardLine />
                                        Overview
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
