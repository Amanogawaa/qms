'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateFormTemplateDTO,
  FormField,
  FormFieldType,
} from '../domain/types';

export function FormTemplateBuilder() {
  const router = useRouter();
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [fields, setFields] = useState<FormField[]>([]);

  const fieldTypes: { value: FormFieldType; label: string }[] = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const template: CreateFormTemplateDTO = {
      name: formName,
      slug: formSlug,
      description: formDescription,
      requiresApproval,
      schema: {
        formId: formSlug,
        title: formName,
        fields,
      },
    };
    console.log('Saving template:', template);
    // TODO: Call API to save template
    router.push('/admin/forms');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Form Template
          </h1>
          <p className="text-muted-foreground">Build a new document form</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Form Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
              <CardDescription>
                Basic information about the form template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Form Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Barangay Indigency Certificate"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    setFormSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                    );
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="indigency-certificate"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs. Lowercase, hyphens only.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the form's purpose"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Form Fields</CardTitle>
                  <CardDescription>
                    Add and configure form fields
                  </CardDescription>
                </div>
                <Button onClick={addField} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No fields added yet
                  </p>
                  <Button onClick={addField} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Field
                  </Button>
                </div>
              ) : (
                fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-move"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>

                        <div className="flex-1 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Field Label</Label>
                              <Input
                                placeholder="Field label"
                                value={field.label}
                                onChange={(e) =>
                                  updateField(index, { label: e.target.value })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Field Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: FormFieldType) =>
                                  updateField(index, { type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Placeholder</Label>
                            <Input
                              placeholder="Placeholder text (optional)"
                              value={field.placeholder || ''}
                              onChange={(e) =>
                                updateField(index, {
                                  placeholder: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(index, {
                                    required: e.target.checked,
                                  })
                                }
                                className="rounded"
                              />
                              <span className="text-sm">Required field</span>
                            </label>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview & Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requires-approval">Requires Approval</Label>
                <input
                  id="requires-approval"
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, submissions require officer approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
              <CardDescription>
                How residents will see this form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add fields to see preview
                </p>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold">{formName || 'Form Title'}</h3>
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>
                        {field.label}
                        {field.required && (
                          <span className="text-destructive">*</span>
                        )}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={field.placeholder} disabled />
                      ) : field.type === 'select' ? (
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Template
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
