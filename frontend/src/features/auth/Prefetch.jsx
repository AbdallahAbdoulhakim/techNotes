import store from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Prefetch = () => {
  const { isAdmin, isManager } = useAuth();

  useEffect(() => {
    let users;
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());

    if (isAdmin || isManager) {
      users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
    }

    return () => {
      notes.unsubscribe();
      users?.unsubscribe();
    };

    // eslint-disable-next-line
  }, []);

  return <Outlet />;
};
export default Prefetch;
