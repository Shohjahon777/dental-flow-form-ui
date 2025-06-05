
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Monitor, BarChart3 } from 'lucide-react';

const AdminOverviewTab = () => {
  return (
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
  );
};

export default AdminOverviewTab;
