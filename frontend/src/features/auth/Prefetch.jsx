import store from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Prefetch = () => {
  const { isAdmin, isManager } = useAuth();

  useEffect(() => {
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );

    if (isAdmin || isManager) {
      store.dispatch(
        usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
      );
    }
    // eslint-disable-next-line
  }, []);

  return <Outlet />;
};
export default Prefetch;
