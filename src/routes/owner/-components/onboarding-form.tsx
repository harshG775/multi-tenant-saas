import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { createSiteFn } from "../-functions/create-site.function";
import { ownerStateKey } from "../-functions/owner-state.function";
import { siteNameSchema, subdomainSchema } from "../-lib/subdomain";
import { FormError, OwnerCard } from "./owner-card";

type Errors = { name?: string; subdomain?: string; form?: string };

export function OnboardingForm({ platformHost }: { platformHost: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<Errors>({});
    const [pending, setPending] = useState(false);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        const name = siteNameSchema.safeParse(form.get("name"));
        const subdomain = subdomainSchema.safeParse(form.get("subdomain"));
        if (!name.success || !subdomain.success) {
            setErrors({
                name: name.success ? undefined : name.error.issues[0]?.message,
                subdomain: subdomain.success ? undefined : subdomain.error.issues[0]?.message,
            });
            return;
        }

        setPending(true);
        setErrors({});

        const result = await createSiteFn({ data: { name: name.data, subdomain: subdomain.data } });

        if (!result.ok) {
            setErrors({ [result.field]: result.message });
            setPending(false);
            return;
        }

        await queryClient.invalidateQueries({ queryKey: ownerStateKey });
        await router.navigate({ to: "/owner/dashboard" });
    };

    return (
        <OwnerCard title="Create your site" description="Pick a name and an address. You can change these later.">
            <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                <div className="grid gap-2">
                    <Label htmlFor="name">Site name</Label>
                    <Input id="name" name="name" aria-invalid={!!errors.name} required />
                    <FormError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="subdomain">Site address</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="subdomain"
                            name="subdomain"
                            autoComplete="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            aria-invalid={!!errors.subdomain}
                            required
                        />
                        <span className="text-sm whitespace-nowrap text-muted-foreground">.{platformHost}</span>
                    </div>
                    <FormError message={errors.subdomain} />
                </div>
                <FormError message={errors.form} />
                <Button type="submit" disabled={pending}>
                    {pending ? "Creating site…" : "Create site"}
                </Button>
            </form>
        </OwnerCard>
    );
}
