import type { ComponentType } from "react";

import { template as orderConfirmation } from "./order-confirmation";
import { template as orderUpdate } from "./order-update";
import { template as contactNotification } from "./contact-notification";
import { template as contactConfirmation } from "./contact-confirmation";

export interface TemplateEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  subject: string;
  displayName?: string;
  previewData?: Record<string, unknown>;
  to?: string;
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  "order-confirmation": orderConfirmation,
  "order-update": orderUpdate,
  "contact-notification": contactNotification,
  "contact-confirmation": contactConfirmation,
};

export type TemplateName = keyof typeof TEMPLATES;
