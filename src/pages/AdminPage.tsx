
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Database,
  Shield,
  Settings,
  Monitor
} from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import AdminTabContent from '../components/admin/AdminTabContent';

const AdminPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <AdminHeader userName={user?.name} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-12">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs">
              <FileText className="w-4 h-4 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              <Monitor className="w-4 h-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              <Database className="w-4 h-4 mr-1" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettingsTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminTabContent 
              title="User Management" 
              description="User management functionality will be implemented here." 
            />
          </TabsContent>

          <TabsContent value="content">
            <AdminTabContent 
              title="Content Management" 
              description="Form questions and AI patient scenarios management." 
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminTabContent 
              title="Analytics Dashboard" 
              description="Detailed analytics and reporting will be displayed here." 
            />
          </TabsContent>

          <TabsContent value="system">
            <AdminTabContent 
              title="System Information" 
              description="System health, logs, and maintenance tools." 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
