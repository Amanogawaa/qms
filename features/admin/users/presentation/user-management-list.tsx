'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreVertical, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type {
  UserListItem,
  UserRole,
} from '@/features/admin/users/domain/types';

// Mock data
const mockUsers: UserListItem[] = [
  {
    id: '1',
    email: 'admin@barangay.gov',
    role: 'ADMIN' as UserRole,
    fullName: 'Juan Dela Cruz',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    email: 'officer1@barangay.gov',
    role: 'OFFICER' as UserRole,
    fullName: 'Maria Santos',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: '3',
    email: 'staff@barangay.gov',
    role: 'STAFF' as UserRole,
    fullName: 'Pedro Reyes',
    createdAt: new Date('2025-01-10'),
  },
];

const roleColors: Record<UserRole, string> = {
  ADMIN:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OFFICER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  STAFF: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  RESIDENT: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function UserManagementList() {
  const [users] = useState<UserListItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage staff, officers, and admin accounts
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all system users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No users found matching your search
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {users.filter((u) => u.role === 'ADMIN').length}
            </CardTitle>
            <CardDescription>Administrators</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {users.filter((u) => u.role === 'OFFICER').length}
            </CardTitle>
            <CardDescription>Officers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {users.filter((u) => u.role === 'STAFF').length}
            </CardTitle>
            <CardDescription>Staff Members</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
