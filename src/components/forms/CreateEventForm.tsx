"use client";

import { useActionState } from "react";
import { createEventAction } from "@/lib/actions";
import { initialActionResult } from "@/lib/action-results";
import { FormAlert } from "@/components/FormAlert";
import { SubmitButton } from "@/components/SubmitButton";

interface ChurchOption {
  id: number;
  name: string;
}

export function CreateEventForm({ churches }: { churches: ChurchOption[] }) {
  const [state, formAction] = useActionState(createEventAction, initialActionResult);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Event title *</label>
        <input name="title" required className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea name="description" className="input-field min-h-20" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Start date *</label>
        <input name="startDate" type="date" required className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">End date</label>
        <input name="endDate" type="date" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input name="category" placeholder="e.g. Synod, Youth, PWMU" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Province</label>
        <input name="province" className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Church</label>
        <select name="churchId" className="select-field">
          <option value="">No specific church</option>
          {churches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingText="Creating...">Create Event</SubmitButton>
      </div>
    </form>
  );
}
