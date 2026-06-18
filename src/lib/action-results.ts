export type ActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export const initialActionResult: ActionResult = { success: false };
