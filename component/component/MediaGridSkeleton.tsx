// component/MediaGridSkeleton.tsx
type MediaGridSkeletonProps = {
  count?: number;
};

export default function MediaGridSkeleton({ count = 15 }: MediaGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col">
          <div className="aspect-2/3 w-full rounded-xl bg-white/5 border border-white/5" />
          <div className="mt-2.5 space-y-1.5 px-0.5">
            <div className="h-3.5 bg-white/5 rounded-md w-4/5" />
            <div className="h-3 bg-white/5 rounded-md w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}