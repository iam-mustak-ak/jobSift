import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeCardSkeleton() {
    return (
        <div className="relative">
            {/* Delete button skeleton (small circle) */}
            <Skeleton className="absolute right-0 w-8 h-8 rounded-full" />

            {/* Resume thumbnail skeleton */}
            <Skeleton className="w-[200px] h-[300px] rounded-md border border-dashed" />

            {/* Resume name skeleton */}
            <Skeleton className="w-[120px] h-5 mt-3" />
        </div>
    );
}
