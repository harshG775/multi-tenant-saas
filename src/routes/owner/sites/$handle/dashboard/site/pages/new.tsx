import { RiArrowLeftLine } from "@remixicon/react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { pagePathSchema, pageTitleSchema, slugifyToPath } from "#/lib/puck/config.puck";
import { createOwnerPageFn } from "#/lib/puck/page.function";
import { FormError } from "#/routes/owner/-components/owner-card";
import { getOwnerSitesFn } from "#/routes/owner/-lib/-server/get-owner-sites.function";
import { ownerKeys } from "#/routes/owner/-lib/owner-keys";

type Errors = { title?: string; path?: string };

export const Route = createFileRoute("/owner/sites/$handle/dashboard/site/pages/new")({
    loader: async ({ context, params }) => {
        const sites = await context.queryClient.query({
            queryKey: ownerKeys.sites,
            queryFn: () => getOwnerSitesFn(),
            staleTime: 30_000,
        });
        const site = sites.find((s) => s.handle === params.handle);
        if (!site) {
            throw notFound();
        }
        return { siteId: site.id, handle: params.handle, siteUrl: site.url };
    },
    component: NewPagePage,
});

function NewPagePage() {
    const { siteId, handle, siteUrl } = Route.useLoaderData();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [path, setPath] = useState("/");
    const [pathTouched, setPathTouched] = useState(false);
    const [editingPath, setEditingPath] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [pending, setPending] = useState(false);

    const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const titleResult = pageTitleSchema.safeParse(title);
        const pathResult = pagePathSchema.safeParse(path);
        if (!titleResult.success || !pathResult.success) {
            setErrors({
                title: titleResult.success ? undefined : titleResult.error.issues[0]?.message,
                path: pathResult.success ? undefined : pathResult.error.issues[0]?.message,
            });
            return;
        }

        setPending(true);
        setErrors({});

        const result = await createOwnerPageFn({ data: { siteId, title: titleResult.data, path: pathResult.data } });

        if (!result.ok) {
            setErrors({ [result.field]: result.message });
            setPending(false);
            return;
        }

        await router.navigate({
            to: "/owner/sites/$handle/editor/$pageId",
            params: { handle, pageId: result.id },
        });
    };

    return (
        <main className="grid w-full gap-4 p-6">
            <div className="mx-auto grid w-full max-w-2xl gap-4">
                <Link
                    to="/owner/sites/$handle/dashboard/site/pages"
                    params={{ handle }}
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <RiArrowLeftLine className="size-4" />
                    Pages
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight">Add page</h1>

                <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                    <div className="grid gap-2 rounded-xl border bg-card p-6">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(event) => {
                                const value = event.target.value;
                                setTitle(value);
                                if (!pathTouched) {
                                    setPath(slugifyToPath(value));
                                }
                            }}
                            aria-invalid={!!errors.title}
                            required
                        />
                        <FormError message={errors.title} />
                    </div>

                    <div className="grid gap-2 rounded-xl border bg-card p-6">
                        <span className="text-sm font-medium">Search engine listing</span>
                        {editingPath ? (
                            <div className="grid gap-2">
                                <Label htmlFor="path">Path</Label>
                                <Input
                                    id="path"
                                    value={path}
                                    onChange={(event) => {
                                        setPathTouched(true);
                                        setPath(event.target.value);
                                    }}
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    aria-invalid={!!errors.path}
                                    required
                                />
                                <FormError message={errors.path} />
                            </div>
                        ) : (
                            <div className="grid gap-1">
                                <p className="truncate text-sm text-muted-foreground">
                                    {siteUrl ? `${siteUrl.replace(/^https?:\/\//, "")}${path}` : path}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setEditingPath(true)}
                                    className="w-fit text-sm text-primary underline-offset-4 hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={pending}>
                            {pending ? "Saving…" : "Save"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
