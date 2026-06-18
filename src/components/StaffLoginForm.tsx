"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

type LoginState = { error?: string };

const initialState: LoginState = {};

interface StaffLoginFormProps {
  next: string;
  loginAction: (formData: FormData) => Promise<LoginState | void>;
}

export function StaffLoginForm({ next, loginAction }: StaffLoginFormProps) {
  const [state, formAction] = useActionState(
    async (_prev: LoginState, formData: FormData) => {
      const result = await loginAction(formData);
      return result ?? initialState;
    },
    initialState
  );

  return (
    <form action={formAction} className="section-card space-y-4">
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
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
      <SubmitButton className="btn-primary w-full" pendingText="Signing in...">
        Sign In
      </SubmitButton>
    </form>
  );
}
