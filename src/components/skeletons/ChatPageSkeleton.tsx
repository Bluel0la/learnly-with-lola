
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPageSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        
        {/* User message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 max-w-xs space-y-2">
            <Skeleton className="h-4 w-full ml-auto" />
            <Skeleton className="h-4 w-2/3 ml-auto" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>
        
        {/* AI message */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        
        {/* User message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 max-w-xs">
            <Skeleton className="h-4 w-full ml-auto" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>
      </div>
      
      {/* Chat input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
