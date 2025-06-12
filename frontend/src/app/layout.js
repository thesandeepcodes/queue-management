import "@/styles/globals.css";
import { QueueProvider } from "@/context/QueueContext";
import MainLayout from "@/components/layout/MainLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-800">

        <QueueProvider>
          <MainLayout>{children}</MainLayout>
        </QueueProvider>
      </body>
    </html>
  );
}
