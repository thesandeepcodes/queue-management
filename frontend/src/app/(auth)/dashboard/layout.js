import Link from "next/link";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardSidebarTabs from "@/components/layout/dashboard/SidebarTabs";
import UserProfilePhoto from "@/components/layout/dashboard/UserProfile";

export const metadata = {
  title: "Q'Up - Dashboard",
  description: "Quickly manage long queues with Q'Up!",
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="grid grid-cols-[auto_1fr] w-full h-screen">
        <div className="w-64 h-full bg-neutral-900 p-3">
          <Link
            href="/dashboard"
            className="flex items-center text-3xl font-bold py-2"
          >
            <span className="text-primary">Q'</span>Up
          </Link>

          <DashboardSidebarTabs />
        </div>

        <div className="h-screen grid grid-rows-[auto_1fr]">
          <div className="w-full flex items-center gap-4 justify-between p-3 bg-neutral-900">
            <div></div>
            <div className="flex items-center gap-4">
              <UserProfilePhoto />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 px-8 min-h-0 overflow-y-auto">{children}</div>
        </div>
      </div>
    </DashboardProvider>
  );
}
