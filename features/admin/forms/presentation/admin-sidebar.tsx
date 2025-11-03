import Link from 'next/link';
import { LayoutDashboard, FileText, Users, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Form Builder',
    href: '/admin/forms',
    icon: FileText,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit',
    icon: ScrollText,
  },
];

export function AdminSidebar({ className }: AdminSidebarProps) {
  return (
    <aside
      className={cn('flex h-full w-64 flex-col border-r bg-card', className)}
    >
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">Barangay QMS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@barangay.gov</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
