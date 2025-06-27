import DashboardLayout from "@/components/layout/dashboard/DashboardLayout";

export const metadata = {
  title: "Q'Up - Dashboard",
  description: "Quickly manage long queues with Q'Up!",
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
