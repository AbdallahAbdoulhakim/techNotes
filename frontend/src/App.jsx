import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public/Public";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import DashLayout from "./components/DashLayout";
import Err404 from "./components/Public/Err404";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
          <Route path="*" element={<Err404 home="/dash" />} />
        </Route>
        <Route path="*" element={<Err404 />} />
      </Route>
    </Routes>
  );
};
export default App;
