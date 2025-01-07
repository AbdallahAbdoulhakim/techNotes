import { Outlet } from "react-router-dom";
import DashHeader from "./Dash/DashHeader";
import DashFooter from "./Dash/DashFooter";

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <Outlet />
      <DashFooter />
    </>
  );
};
export default DashLayout;
