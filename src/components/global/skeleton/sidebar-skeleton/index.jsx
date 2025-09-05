"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function SidebarSkeleton() {
  return (
    <Sidebar collapsible="icon" className="h-screen">
      {/* Top (Team Switcher) */}
      <SidebarHeader className="space-y-2 p-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex flex-col space-y-1 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="space-y-6 px-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 ml-1" /> {/* Section label */}
          <div className="space-y-2 pl-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 ml-1" /> {/* Section label */}
          <div className="space-y-2 pl-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="p-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col space-y-1 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </SidebarFooter>

      {/* Collapsed rail */}
      <SidebarRail />
    </Sidebar>
  );
}
