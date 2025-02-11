import { useParams } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import Spinner from "../../components/Spinner";
import EditNoteForm from "./EditNoteForm";
import AlternativeAlertError from "../../components/Public/AlternativeAlertError";

const EditNote = () => {
  const { id } = useParams();

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({ note: data?.entities[id] }),
  });

  return (
    <>
      {note ? (
        <EditNoteForm note={note} />
      ) : (
        <div className="p-4 h-auto pt-20">
          <AlternativeAlertError
            code="400"
            message="Note does not exist or no access!"
            cancelText="Return to Home Page"
            cancelLink="/"
            resultLink="/dash"
            resultText="Dashboard"
          />
        </div>
      )}
    </>
  );
};
export default EditNote;
