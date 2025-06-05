
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminTabContentProps {
  title: string;
  description: string;
}

const AdminTabContent = ({ title, description }: AdminTabContentProps) => {
  return (
    <Card className="dental-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdminTabContent;
