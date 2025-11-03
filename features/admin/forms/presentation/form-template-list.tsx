'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreVertical, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { FormTemplate } from '../domain/types';

// Mock data for demonstration
const mockTemplates: FormTemplate[] = [
  {
    id: '1',
    name: 'Barangay Indigency Certificate',
    slug: 'indigency-certificate',
    description: 'Certificate of indigency for medical or financial assistance',
    schema: {
      formId: 'indigency-certificate',
      title: 'Barangay Indigency Certificate',
      fields: [],
    },
    isActive: true,
    requiresApproval: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    createdById: 'admin-1',
  },
  {
    id: '2',
    name: 'Barangay Clearance',
    slug: 'barangay-clearance',
    description: 'General barangay clearance for various purposes',
    schema: {
      formId: 'barangay-clearance',
      title: 'Barangay Clearance',
      fields: [],
    },
    isActive: true,
    requiresApproval: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    createdById: 'admin-1',
  },
  {
    id: '3',
    name: 'Business Permit Application',
    slug: 'business-permit',
    description: 'Application for barangay business permit',
    schema: {
      formId: 'business-permit',
      title: 'Business Permit Application',
      fields: [],
    },
    isActive: false,
    requiresApproval: true,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    createdById: 'admin-1',
  },
];

export function FormTemplateList() {
  const [templates] = useState<FormTemplate[]>(mockTemplates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Templates</h1>
          <p className="text-muted-foreground">
            Create and manage form templates for different document types
          </p>
        </div>
        <Link href="/admin/forms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant={template.isActive ? 'default' : 'secondary'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {template.requiresApproval && (
                    <Badge variant="outline">Requires Approval</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {template.schema.fields.length} fields
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No form templates yet
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first form template to get started
            </p>
            <Link href="/admin/forms/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
