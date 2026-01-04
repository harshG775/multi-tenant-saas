import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute("/t/$")({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/$"!</div>
}
