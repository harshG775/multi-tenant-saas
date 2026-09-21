import { RiDashboardLine, RiGlobalLine } from "@remixicon/react";
import { Link, useRouterState } from "@tanstack/react-router";
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
import { useSignOut } from "../../-lib/use-sign-out";

const links = [
    { to: "/owner/dashboard/sites", label: "Sites", icon: RiGlobalLine, exact: false },
] as const;

type DashboardSidebarProps = {
    owner: { name: string; email: string };
};

export default function DashboardSidebar({ owner }: DashboardSidebarProps) {
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const signOut = useSignOut();
    const isActive = (to: string, exact: boolean) =>
        exact ? pathname.replace(/\/$/, "") === to : pathname.startsWith(to);

    return (
        <Sidebar>
            <SidebarHeader>
                <span className="px-2 py-1 text-base font-semibold">Multi-Tenant SaaS</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Owner</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map(({ to, label, icon: Icon, exact }) => (
                                <SidebarMenuItem key={to}>
                                    <SidebarMenuButton asChild isActive={isActive(to, exact)}>
                                        <Link to={to}>
                                            <Icon />
                                            {label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="grid px-2 text-sm">
                    <span className="truncate font-medium">{owner.name}</span>
                    <span className="truncate text-muted-foreground">{owner.email}</span>
                </div>
                <Button variant="outline" onClick={signOut}>
                    Sign out
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
