"use client";

import { useActionState } from "react";
import { uploadReportAction } from "@/lib/actions";
import { initialActionResult } from "@/lib/action-results";
import { FormAlert } from "@/components/FormAlert";
import { SubmitButton } from "@/components/SubmitButton";

interface ChurchOption {
  id: number;
  name: string;
}

export function UploadReportForm({ churches }: { churches: ChurchOption[] }) {
  const [state, formAction] = useActionState(uploadReportAction, initialActionResult);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Report title *</label>
        <input name="title" required className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea name="description" className="input-field min-h-20" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Visibility *</label>
        <select name="visibility" className="select-field" defaultValue="private">
          <option value="private">Private — staff only</option>
          <option value="public">Public — anyone can view & download</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Report type</label>
        <select name="reportType" className="select-field">
          <option value="general">General</option>
          <option value="financial">Financial</option>
          <option value="outreach">Outreach</option>
          <option value="synod">Synod</option>
          <option value="membership">Membership</option>
        </select>
      </div>
      <div>
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
        <label className="mb-1 block text-sm font-medium">Presbytery</label>
        <input name="presbytery" placeholder="Optional" className="input-field" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">File *</label>
        <input
          name="file"
          type="file"
          required
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-500">
          PDF, Word, Excel, CSV, or text files
        </p>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingText="Uploading...">Upload Report</SubmitButton>
      </div>
    </form>
  );
}
