"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/ui/status-page";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <StatusPage kind="error" onRetry={retry} />;
}
