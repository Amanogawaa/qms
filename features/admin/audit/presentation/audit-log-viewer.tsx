'use client';

import { useState } from 'react';
import { Filter, Eye } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuditLogListItem } from '../domain/types';

// Mock data
const mockLogs: AuditLogListItem[] = [
  {
    id: '1',
    action: 'form.created',
    entityType: 'FormTemplate',
    entityId: 'form-123',
    userName: 'Juan Dela Cruz',
    actorRole: 'ADMIN',
    timestamp: new Date('2025-11-03T10:30:00'),
  },
  {
    id: '2',
    action: 'user.created',
    entityType: 'User',
    entityId: 'user-456',
    userName: 'Juan Dela Cruz',
    actorRole: 'ADMIN',
    timestamp: new Date('2025-11-03T09:15:00'),
  },
  {
    id: '3',
    action: 'submission.approved',
    entityType: 'FormSubmission',
    entityId: 'sub-789',
    userName: 'Maria Santos',
    actorRole: 'OFFICER',
    timestamp: new Date('2025-11-03T08:45:00'),
  },
  {
    id: '4',
    action: 'ticket.issued',
    entityType: 'Ticket',
    entityId: 'ticket-101',
    userName: 'System',
    actorRole: undefined,
    timestamp: new Date('2025-11-03T08:00:00'),
  },
];

const actionColors: Record<string, string> = {
  created: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  updated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  approved:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  rejected:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  issued: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
};

function getActionColor(action: string): string {
  const actionType = action.split('.')[1] || 'default';
  return (
    actionColors[actionType] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  );
}

export function AuditLogViewer() {
  const [logs] = useState<AuditLogListItem[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      entityTypeFilter === 'all' || log.entityType === entityTypeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all system activities and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Complete audit trail of all system actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Input
              placeholder="Search by action, entity, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={entityTypeFilter}
              onValueChange={setEntityTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FormTemplate">Form Templates</SelectItem>
                <SelectItem value="User">Users</SelectItem>
                <SelectItem value="FormSubmission">Submissions</SelectItem>
                <SelectItem value="Ticket">Tickets</SelectItem>
                <SelectItem value="Queue">Queues</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.entityId}
                  </TableCell>
                  <TableCell>{log.userName || 'System'}</TableCell>
                  <TableCell>
                    {log.actorRole ? (
                      <Badge variant="outline">{log.actorRole}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No audit logs found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{logs.length}</CardTitle>
            <CardDescription>Total Activities</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {
                logs.filter((l) => {
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 1);
                  return l.timestamp > dayAgo;
                }).length
              }
            </CardTitle>
            <CardDescription>Last 24 Hours</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {new Set(logs.map((l) => l.userName)).size}
            </CardTitle>
            <CardDescription>Active Users</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {new Set(logs.map((l) => l.entityType)).size}
            </CardTitle>
            <CardDescription>Entity Types</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
