import { Outlet } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <SidebarNavigation />

      {/* ✅ Allow scrolling here */}
      <main className="flex-1 ml-20 p-6 flex flex-col bg-[#f3f3f3] overflow-y-auto scrollbar-hide">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;