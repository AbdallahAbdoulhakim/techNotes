import { CiEdit } from "react-icons/ci";

import { useGetNotesQuery } from "./notesApiSlice";
import AlertError from "../../components/AlertError";
import Spinner from "../../components/Spinner";
import NoteRow from "./NoteRow";

import { Dropdown } from "flowbite";
import { useEffect } from "react";
import ListHeader from "../../components/Dash/ListHeader";
import ListFooter from "../../components/Dash/ListFooter";

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery();

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
    const { ids } = notes;

    const tabContent = ids?.length
      ? ids.map((noteId) => <NoteRow key={noteId} noteId={noteId} />)
      : null;

    content = (
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <ListHeader entity="note" addLink="/dash/notes/new" />
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
