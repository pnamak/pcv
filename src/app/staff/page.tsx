import { redirect } from "next/navigation";
import { getStaffUser, staffLoginPath } from "@/lib/auth";
import { staffLoginAction } from "@/lib/actions";
import { Logo } from "@/components/Logo";
import { StaffLoginForm } from "@/components/StaffLoginForm";

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function StaffLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next || "/staff/dashboard";
  const user = await getStaffUser();

  if (user) {
    redirect(next.startsWith("/staff") ? next : "/staff/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-10 sm:py-16">
      <div className="mb-6 flex justify-center">
        <Logo size="lg" showText={false} href={undefined} />
      </div>
      <h1 className="mb-2 text-center text-xl font-bold text-pcv-burgundy sm:text-2xl">
        Staff Login
      </h1>
      <p className="mb-6 text-center text-sm text-gray-600 sm:mb-8">
        Sign in to manage churches, pastors, reports, and news.
      </p>

      <StaffLoginForm next={next} loginAction={staffLoginAction} />

      <p className="mt-4 text-center text-xs text-gray-500">
        Demo: admin@pcv.vu / admin123
      </p>
    </div>
  );
}
