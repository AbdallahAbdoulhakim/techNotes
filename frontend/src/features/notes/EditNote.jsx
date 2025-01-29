import { useParams } from "react-router-dom";
import { selectNoteById } from "./notesApiSlice";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import EditNoteForm from "./EditNoteForm";

const EditNote = () => {
  const { id } = useParams();
  const note = useSelector((state) => selectNoteById(state, id));

  return <>{note ? <EditNoteForm note={note} /> : <Spinner />}</>;
};
export default EditNote;
