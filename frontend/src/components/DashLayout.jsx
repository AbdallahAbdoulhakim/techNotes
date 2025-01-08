import { Outlet } from "react-router-dom";
import DashHeader from "./Dash/DashHeader";
import DashFooter from "./Dash/DashFooter";
import Aside from "./Dash/Aside";

import { initFlowbite } from "flowbite";
import { useEffect } from "react";

const DashLayout = () => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen">
        <DashHeader />
        <Aside />
        <main className="p-4 md:ml-64 h-auto pt-20">
          <Outlet />
          <DashFooter />
        </main>
      </div>
    </>
  );
};
export default DashLayout;
