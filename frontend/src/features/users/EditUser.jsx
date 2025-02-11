import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import Spinner from "../../components/Spinner";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  return <>{user ? <EditUserForm user={user} /> : <Spinner />}</>;
};
export default EditUser;
