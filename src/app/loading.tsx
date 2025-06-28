import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoading() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <Skeleton className="h-9 w-9" />
        </main>
    );
}
