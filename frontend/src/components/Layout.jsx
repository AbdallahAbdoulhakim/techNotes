import { Outlet } from "react-router-dom";
import { initFlowbite } from "flowbite";
import { useEffect } from "react";

const Layout = () => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return <Outlet />;
};
export default Layout;
