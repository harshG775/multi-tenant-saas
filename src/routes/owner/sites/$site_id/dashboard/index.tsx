import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/owner/sites/$site_id/dashboard/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/dashboard/sites/$site_id/dashboard/"!</div>
}
