import { notFound } from "next/navigation";

/** Any address under /en or /ar that isn't a real page shows the branded 404. */
export default function Missing() {
  notFound();
}
