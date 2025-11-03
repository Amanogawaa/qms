import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage forms, users, and view system activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  F
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New form created</p>
                  <p className="text-xs text-muted-foreground">
                    Business Permit Application
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">2m ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                  U
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">User registered</p>
                  <p className="text-xs text-muted-foreground">
                    officer@barangay.gov
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">5m ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  S
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Submission approved</p>
                  <p className="text-xs text-muted-foreground">
                    Indigency Certificate #1234
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">12m ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-lg border p-3 text-left hover:bg-accent">
              <p className="text-sm font-medium">Create New Form Template</p>
              <p className="text-xs text-muted-foreground">
                Build a new document type
              </p>
            </button>
            <button className="w-full rounded-lg border p-3 text-left hover:bg-accent">
              <p className="text-sm font-medium">Add Staff Member</p>
              <p className="text-xs text-muted-foreground">
                Create officer or admin account
              </p>
            </button>
            <button className="w-full rounded-lg border p-3 text-left hover:bg-accent">
              <p className="text-sm font-medium">View Audit Logs</p>
              <p className="text-xs text-muted-foreground">
                Review system activity
              </p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
