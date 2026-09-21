import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { ownerAuthClient } from "#/lib/auth/owner-client";
import { ownerStateKey } from "../-functions/owner-state.function";
import { FormError, OwnerCard } from "./owner-card";

export function SignupForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        setPending(true);
        setError(null);

        const { error: signUpError } = await ownerAuthClient.signUp.email({
            name: String(form.get("name")).trim(),
            email: String(form.get("email")).trim(),
            password: String(form.get("password")),
        });

        if (signUpError) {
            setError(signUpError.message ?? "Could not create your account.");
            setPending(false);
            return;
        }

        await queryClient.invalidateQueries({ queryKey: ownerStateKey });
        await router.navigate({ to: "/owner/onboarding" });
    };

    return (
        <OwnerCard
            title="Create your account"
            description="Start building your site."
            footer={
                <span>
                    Already have an account?{" "}
                    <Link to="/owner/login" className="text-primary underline-offset-4 hover:underline">
                        Log in
                    </Link>
                </span>
            }
        >
            <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" autoComplete="name" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                </div>
                <FormError message={error} />
                <Button type="submit" disabled={pending}>
                    {pending ? "Creating account…" : "Create account"}
                </Button>
            </form>
        </OwnerCard>
    );
}
