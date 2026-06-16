import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { StaffNav } from "@/components/StaffNav";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getStaffUser();

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {user && <StaffNav />}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
