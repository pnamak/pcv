"use client";

import { useActionState } from "react";
import {
  createChurchAction,
} from "@/lib/actions";
import { initialActionResult } from "@/lib/action-results";
import { FormAlert } from "@/components/FormAlert";
import { SubmitButton } from "@/components/SubmitButton";
import { MapLocationPicker } from "@/components/MapLocationPicker";

interface PastorOption {
  id: number;
  firstName: string;
  lastName: string;
}

export function CreateChurchForm({ pastors }: { pastors: PastorOption[] }) {
  const [state, formAction] = useActionState(createChurchAction, initialActionResult);

  return (
    <form action={formAction} encType="multipart/form-data" className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Church name *</label>
        <input name="name" required className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Area council</label>
        <input name="areaCouncil" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Session name</label>
        <input name="sessionName" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Presbytery</label>
        <input name="presbytery" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Island</label>
        <input name="island" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Province</label>
        <input name="province" className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Assigned pastor</label>
        <select name="pastorId" className="select-field">
          <option value="">Vacant</option>
          {pastors.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Member count</label>
        <input name="memberCount" type="number" min="0" className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Service times</label>
        <input name="serviceTimes" placeholder="e.g. Sunday 9:00 AM" className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Tags</label>
        <input name="tags" placeholder="PWMU, Sunday School (comma-separated)" className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Church logo *</label>
        <input
          name="logo"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, WebP, GIF, or SVG — max 2 MB. Used on church listings and news about this church.
        </p>
      </div>
      <div className="sm:col-span-2">
        <MapLocationPicker />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingText="Creating...">Create Church</SubmitButton>
      </div>
    </form>
  );
}
