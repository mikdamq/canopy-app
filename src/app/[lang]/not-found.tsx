import type { Metadata } from "next";
import { StatusPage } from "@/components/ui/status-page";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return <StatusPage kind="notFound" />;
}
