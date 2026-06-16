import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { staffLoginAction } from "@/lib/actions";

export default async function StaffLoginPage() {
  const user = await getStaffUser();
  if (user) redirect("/staff/dashboard");

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center py-16">
      <h1 className="mb-2 text-2xl font-bold text-pcv-burgundy">Staff Login</h1>
      <p className="mb-8 text-sm text-gray-600">
        Sign in to manage churches, pastors, reports, and news.
      </p>

      <form
        action={async (formData) => {
          "use server";
          await staffLoginAction(formData);
        }}
        className="section-card space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="input-field"
            defaultValue="admin@pcv.vu"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Sign In
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Demo: admin@pcv.vu / admin123
      </p>
    </div>
  );
}
