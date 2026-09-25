import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/owner/sites/$handle/dashboard/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/dashboard/sites/$handle/dashboard/"!</div>
}
