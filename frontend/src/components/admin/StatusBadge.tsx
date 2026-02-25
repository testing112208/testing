import type { BookingStatus } from "@/data/mockBookings";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Completed: "bg-sky-100 text-sky-700 border-sky-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", statusStyles[status])}>
    {status}
  </span>
);

export default StatusBadge;
