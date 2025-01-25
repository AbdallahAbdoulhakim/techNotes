import { useParams } from "react-router-dom";
import { selectUserById } from "./usersApiSlice";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));

  return <>{user ? <EditUserForm user={user} /> : <Spinner />}</>;
};
export default EditUser;
