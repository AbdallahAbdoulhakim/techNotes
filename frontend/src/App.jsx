import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public/Public";
import Login from "./components/Public/Login";
import Register from "./components/Public/Register";
import DashLayout from "./components/DashLayout";
import Err404 from "./components/Public/Err404";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="dash" element={<DashLayout />}>
          <Route path="*" element={<Err404 home="/dash" />} />
        </Route>
        <Route path="*" element={<Err404 />} />
      </Route>
    </Routes>
  );
};
export default App;
