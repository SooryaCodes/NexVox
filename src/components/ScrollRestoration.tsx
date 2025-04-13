"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
} 