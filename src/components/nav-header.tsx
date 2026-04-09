
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

/**
 * A client-side header component that handles global navigation elements.
 * It automatically hides itself on the authentication page to provide a focused entry experience.
 */
export function NavHeader() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  // Hide the navigation header on the authentication page
  if (pathname === '/auth') return null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 md:px-8 border-b bg-background/50 backdrop-blur sticky top-0 z-30">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex-1 flex items-center gap-4">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest font-headline">NTET Prep Pro</h2>
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded-full animate-pulse border border-destructive/20">
            <WifiOff className="w-3 h-3" /> OFFLINE
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
