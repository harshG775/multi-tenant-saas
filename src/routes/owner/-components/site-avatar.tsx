import { cn } from "#/lib/utils";

/** Stable color per set of letters: the same initials always map to the same hue. */
const avatarColor = (initials: string) => {
    let hash = 0;
    for (const char of initials) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360;
    }
    return `hsl(${hash} 55% 40%)`;
};

export function SiteAvatar({ name, className }: { name: string; className?: string }) {
    const initials = name.slice(0, 3).toUpperCase();
    return (
        <div
            className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-md text-xs font-medium text-white",
                className,
            )}
            style={{ backgroundColor: avatarColor(initials) }}
        >
            {initials}
        </div>
    );
}
