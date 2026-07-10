import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: component })

function component() {
    const { tenant } = Route.useRouteContext()
    return (
        <main>
            <section className="p-6 flex items-center gap-4">
                <img
                    src={tenant.meta.logo}
                    alt={tenant.meta.name}
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                />

                <div>
                    <h1>Welcome to {tenant.meta.name}</h1>
                    <p>{tenant.meta.description}</p>

                    <small>Hostname: {tenant.hostname}</small>
                </div>
            </section>
        </main>
    )
}
