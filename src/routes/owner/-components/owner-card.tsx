import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#/components/ui/card";

type OwnerCardProps = {
    title: string;
    description: string;
    footer?: ReactNode;
    children: ReactNode;
};

export function OwnerCard({ title, description, footer, children }: OwnerCardProps) {
    return (
        <main className="grid min-h-svh place-items-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
                {footer ? <CardFooter className="text-sm text-muted-foreground">{footer}</CardFooter> : null}
            </Card>
        </main>
    );
}

export function FormError({ id, message }: { id?: string; message?: string | null }) {
    if (!message) {
        return null;
    }

    return (
        <p id={id} role="alert" className="text-sm text-destructive">
            {message}
        </p>
    );
}
