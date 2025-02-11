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
import CreateNewUser from "./features/users/CreateNewUser";
import EditUser from "./features/users/EditUser";
import CreateNewNote from "./features/notes/CreateNewNote";
import EditNote from "./features/notes/EditNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

const App = () => {
  useTitle("Dan D. Repairs");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route exact path="new" element={<CreateNewNote />} />
                  <Route path=":id" element={<EditNote />} />
                </Route>
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route exact path="new" element={<CreateNewUser />} />
                    <Route path=":id" element={<EditUser />} />
                  </Route>
                </Route>
                <Route path="*" element={<Err404 home="/dash" />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Err404 />} />
      </Route>
    </Routes>
  );
};
export default App;
