import type { ActionResult } from "@/lib/action-results";

export function FormAlert({ state }: { state: ActionResult }) {
  if (state.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {state.error}
      </div>
    );
  }

  if (state.success && state.message) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {state.message}
      </div>
    );
  }

  return null;
}
