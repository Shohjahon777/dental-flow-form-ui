
import { Settings } from 'lucide-react';

interface AdminHeaderProps {
  userName?: string;
}

const AdminHeader = ({ userName }: AdminHeaderProps) => {
  return (
    <header className="dental-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-teal-600" />
            Admin Panel
          </h1>
          <div className="text-sm text-gray-600">Welcome, {userName}</div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
