import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

export function RouteError({ error, reset }: ErrorComponentProps) {
    const message = error instanceof Error ? error.message : "Something went wrong.";

    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <div className="grid max-w-md gap-4 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
                <p className="text-muted-foreground">{message}</p>
                <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={reset}>
                        Try again
                    </Button>
                    <Button asChild>
                        <Link to="/$" params={{ _splat: "" }}>
                            Go home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
