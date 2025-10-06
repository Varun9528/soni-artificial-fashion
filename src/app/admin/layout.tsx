import AdminLayout from '@/components/admin/AdminLayout';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AdminLayout>{children}</AdminLayout>
      </NotificationProvider>
    </AuthProvider>
  );
}