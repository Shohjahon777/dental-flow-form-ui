
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Database,
  Shield,
  Bell,
  Palette,
  Monitor,
  Save
} from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Dental Training Platform',
    maintenanceMode: false,
    allowRegistration: true,
    enableNotifications: true,
    maxUsersPerSession: 50,
    sessionTimeout: 30
  });

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    toast({
      title: "Settings saved",
      description: "All changes have been applied successfully.",
    });
  };

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
      <header className="dental-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-teal-600" />
              Admin Panel
            </h1>
            <div className="text-sm text-gray-600">Welcome, {user?.name}</div>
          </div>
        </div>
      </header>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="dental-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-4 h-4 mr-2 text-teal-600" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-700">142</div>
                  <p className="text-sm text-gray-600">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="dental-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-cyan-600" />
                    Forms Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-700">2,847</div>
                  <p className="text-sm text-gray-600">+24% from last month</p>
                </CardContent>
              </Card>

              <Card className="dental-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Monitor className="w-4 h-4 mr-2 text-blue-600" />
                    AI Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">1,234</div>
                  <p className="text-sm text-gray-600">+18% from last month</p>
                </CardContent>
              </Card>

              <Card className="dental-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">94.2%</div>
                  <p className="text-sm text-gray-600">+2.1% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="text-lg">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="dental-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      className="dental-input"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Temporarily disable access to the platform</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Registration</Label>
                      <p className="text-sm text-gray-600">Enable new user registration</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Notifications</Label>
                      <p className="text-sm text-gray-600">Send system notifications to users</p>
                    </div>
                    <Switch
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveSettings} className="dental-button-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="text-lg">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="text-lg">Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Form questions and AI patient scenarios management.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed analytics and reporting will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">System health, logs, and maintenance tools.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
