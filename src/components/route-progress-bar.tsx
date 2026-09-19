import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Progress } from "#/components/ui/progress";

export function RouteProgressBar() {
    const isNavigating = useRouterState({ select: (state) => state.status === "pending" });

    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        clearInterval(intervalRef.current);
        clearTimeout(hideTimeoutRef.current);
        clearTimeout(resetTimeoutRef.current);

        if (isNavigating) {
            setIsVisible(true);
            setProgress(15);

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 85) {
                        clearInterval(intervalRef.current);
                        return prev;
                    }
                    const step = Math.max(1, (85 - prev) / 10);
                    return Math.min(prev + step, 85);
                });
            }, 200);
        } else {
            setProgress((prev) => (prev === 0 ? 0 : 100));

            hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
                resetTimeoutRef.current = setTimeout(() => setProgress(0), 200);
            }, 300);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(hideTimeoutRef.current);
            clearTimeout(resetTimeoutRef.current);
        };
    }, [isNavigating]);

    if (!isVisible && progress === 0) return null;

    return (
        <Progress
            value={progress}
            aria-label="Page loading"
            className="pointer-events-none fixed top-0 left-0 z-100 h-0.5 rounded-none bg-transparent"
        />
    );
}
