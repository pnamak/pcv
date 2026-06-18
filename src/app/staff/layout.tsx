import { getStaffUser } from "@/lib/auth";
import { StaffNav } from "@/components/StaffNav";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getStaffUser();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col md:flex-row">
      {user && <StaffNav userName={user.name} />}
      <div className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</div>
    </div>
  );
}
