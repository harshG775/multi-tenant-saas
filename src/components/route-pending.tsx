import { RiLoader4Line } from "@remixicon/react";

export function RoutePending() {
    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <RiLoader4Line className="size-6 animate-spin text-muted-foreground" />
        </main>
    );
}
