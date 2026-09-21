import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ownerAuthClient } from "#/lib/auth/owner-client";
import { ownerKeys } from "./owner-keys";

/** Signs the owner out, drops all cached owner data and goes to the signin page. */
export function useSignOut() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return async () => {
        await ownerAuthClient.signOut();
        await queryClient.invalidateQueries({ queryKey: ownerKeys.all });
        await router.navigate({ to: "/owner/signin" });
    };
}
