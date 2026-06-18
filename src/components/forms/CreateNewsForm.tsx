"use client";

import { useActionState } from "react";
import { createNewsAction } from "@/lib/actions";
import { initialActionResult } from "@/lib/action-results";
import { FormAlert } from "@/components/FormAlert";
import { SubmitButton } from "@/components/SubmitButton";

interface ChurchOption {
  id: number;
  name: string;
}

export function CreateNewsForm({ churches }: { churches: ChurchOption[] }) {
  const [state, formAction] = useActionState(createNewsAction, initialActionResult);

  return (
    <form action={formAction} className="space-y-4">
      <FormAlert state={state} />
      <div>
        <label className="mb-1 block text-sm font-medium">Title *</label>
        <input name="title" required className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Summary</label>
        <input name="summary" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Content *</label>
        <textarea name="content" required className="input-field min-h-40" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Related church</label>
        <select name="churchId" className="select-field">
          <option value="">PCV general (use PCV logo)</option>
          {churches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          News about a specific church will display that church&apos;s logo.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select name="status" className="select-field">
          <option value="draft">Save as Draft</option>
          <option value="published">Publish Immediately</option>
        </select>
      </div>
      <SubmitButton pendingText="Saving...">Create Article</SubmitButton>
    </form>
  );
}
