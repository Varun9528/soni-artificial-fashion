import AdminLayout from '@/components/admin/AdminLayout';
import { NotificationProvider } from '@/context/NotificationContext';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <NotificationProvider>
          <AdminLayout>{children}</AdminLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}