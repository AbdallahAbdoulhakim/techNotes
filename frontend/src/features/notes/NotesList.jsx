import { CiEdit } from "react-icons/ci";

import { useGetNotesQuery } from "./notesApiSlice";
import AlertError from "../../components/AlertError";
import Spinner from "../../components/Spinner";
import NoteRow from "./NoteRow";
import DeleteItem from "../../components/Dash/DeleteItem";

import { Dropdown } from "flowbite";
import { useEffect, useState } from "react";
import ListHeader from "../../components/Dash/ListHeader";
import ListFooter from "../../components/Dash/ListFooter";

import useAuth from "../../hooks/useAuth";

import { useDeleteNoteMutation } from "./notesApiSlice";

import useTitle from "../../hooks/useTitle";

const NotesList = () => {
  useTitle("Notes List");
  const { isAdmin, isManager, username } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [itemToDelete, setItemToDelete] = useState(null);

  const [
    deleteNote,
    { isSuccess: isDelSuccess, error: delError, isError: isDelError },
  ] = useDeleteNoteMutation();

  let content;

  if (isLoading) {
    content = <Spinner />;
  }

  if (isError) {
    content = (
      <AlertError
        code={error?.originalStatus || "Unkown"}
        message={[
          error?.error || error?.data?.message || "Something went wrong!",
        ]}
      />
    );
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;

    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId].user.username === username
      );
    }

    const tabContent = filteredIds?.length
      ? filteredIds.map((noteId) => (
          <NoteRow
            key={noteId}
            noteId={noteId}
            setItemToDelete={setItemToDelete}
          />
        ))
      : null;

    content = (
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <ListHeader entity="note" addLink="/dash/notes/new" />
        {isDelError && (
          <AlertError message={[delError?.data?.error]} dismissible={true} />
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Ticket
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">
                  Owner
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Created
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Updated
                </th>
                <th scope="col" className="px-4 py-3 flex justify-end">
                  <CiEdit className="text-2xl text-slate-900" />
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>{tabContent}</tbody>
          </table>
        </div>
        <ListFooter />
        <DeleteItem
          item="note"
          itemTitle={itemToDelete?.title}
          handleAction={async () => await deleteNote({ id: itemToDelete?.id })}
          isDelError={isDelError}
          isDelSuccess={isDelSuccess}
        />
      </div>
    );
  }

  useEffect(() => {
    const $dropDowns = document.querySelectorAll(".table-row");

    $dropDowns.forEach((drop) => {
      const $targetEl = drop.querySelector('[id$="-dropdown"]');
      const $triggerEl = drop.querySelector('[id$="-dropdown-button"]');

      const options = {
        placement: "left",
        triggerType: "click",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        ignoreClickOutsideClass: false,
      };

      const instanceOptions = {
        id: $targetEl.id,
        override: true,
      };

      new Dropdown($targetEl, $triggerEl, options, instanceOptions);
    });
  }, [notes]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">{content}</div>
    </section>
  );
};
export default NotesList;
