// Domain types for Form Management

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: string[]; // For select, radio, checkbox
  defaultValue?: string | number | boolean;
}

export interface FormSchema {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  schema: FormSchema;
  isActive: boolean;
  requiresApproval: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface CreateFormTemplateDTO {
  name: string;
  slug: string;
  description?: string;
  schema: FormSchema;
  requiresApproval?: boolean;
}

export interface UpdateFormTemplateDTO {
  id: string;
  name?: string;
  description?: string;
  schema?: FormSchema;
  isActive?: boolean;
  requiresApproval?: boolean;
}
