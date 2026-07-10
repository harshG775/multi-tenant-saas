import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant-not-found')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>We couldn't find that workspace.</div>
}
