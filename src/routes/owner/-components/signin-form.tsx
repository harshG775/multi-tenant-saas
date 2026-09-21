import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { ownerAuthClient } from "#/lib/auth/owner-client";
import { ownerKeys } from "../-lib/owner-keys";
import { FormError, OwnerCard } from "./owner-card";

export function SigninForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        setPending(true);
        setError(null);

        const { error: signInError } = await ownerAuthClient.signIn.email({
            email: String(form.get("email")).trim(),
            password: String(form.get("password")),
        });

        if (signInError) {
            setError(signInError.message ?? "Could not sign you in.");
            setPending(false);
            return;
        }

        await queryClient.invalidateQueries({ queryKey: ownerKeys.all });
        await router.navigate({ to: "/owner/dashboard" });
    };

    return (
        <OwnerCard
            title="Sign in"
            description="Welcome back."
            footer={
                <span>
                    New here?{" "}
                    <Link to="/owner/signup" className="text-primary underline-offset-4 hover:underline">
                        Create an account
                    </Link>
                </span>
            }
        >
            <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>
                <FormError message={error} />
                <Button type="submit" disabled={pending}>
                    {pending ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </OwnerCard>
    );
}
