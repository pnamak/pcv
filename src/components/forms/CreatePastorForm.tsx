"use client";

import { useActionState } from "react";
import { createPastorAction } from "@/lib/actions";
import { initialActionResult } from "@/lib/action-results";
import { FormAlert } from "@/components/FormAlert";
import { SubmitButton } from "@/components/SubmitButton";

interface ChurchOption {
  id: number;
  name: string;
}

export function CreatePastorForm({ churches }: { churches: ChurchOption[] }) {
  const [state, formAction] = useActionState(createPastorAction, initialActionResult);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">First name *</label>
        <input name="firstName" required className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Last name *</label>
        <input name="lastName" required className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input name="email" type="email" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone</label>
        <input name="phone" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Rank</label>
        <input name="rank" defaultValue="Pastor" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Ordination year</label>
        <input name="ordinationYear" type="number" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Island of origin</label>
        <input name="islandOrigin" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Village of origin</label>
        <input name="villageOrigin" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select name="status" className="select-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Assigned church</label>
        <select name="churchId" className="select-field">
          <option value="">No church assignment</option>
          {churches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingText="Creating...">Create Pastor</SubmitButton>
      </div>
    </form>
  );
}
