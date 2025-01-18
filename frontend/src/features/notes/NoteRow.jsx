import { Link } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa";
import { FiSlash } from "react-icons/fi";

import { useSelector } from "react-redux";

import { selectNoteById } from "./notesApiSlice";

const NoteRow = ({ noteId }) => {
  const note = useSelector((state) => selectNoteById(state, noteId));
  console.log(note);

  if (note) {
    const created = new Date(note.createdAt).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    const updated = new Date(note.createdAt).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    return (
      <tr className="border-b dark:border-gray-700 table-row">
        <th
          scope="row"
          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {note.ticket}
        </th>
        <td className="px-4 py-3">
          {note.completed ? (
            <FaCheckDouble className="text-green-600" size={25} />
          ) : (
            <FiSlash className="text-red-600" size={25} />
          )}
        </td>
        <td className="px-4 py-3">{note.title}</td>
        <td className="px-4 py-3 hidden md:table-cell">{note.user.username}</td>
        <td className="px-4 py-3 hidden lg:table-cell">{created}</td>
        <td className="px-4 py-3 hidden lg:table-cell">{updated}</td>
        <td className="px-4 py-3 flex items-center justify-end">
          <button
            id={`${noteId}-dropdown-button`}
            data-dropdown-toggle={`${noteId}-dropdown`}
            className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
            type="button"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          <div
            id={`${noteId}-dropdown`}
            className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
          >
            <ul
              className="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby={`${noteId}-dropdown-button`}
            >
              <li>
                <Link
                  to={`/dash/notes/${noteId}`}
                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </Link>
              </li>
            </ul>
            <div className="py-1">
              <Link
                to="/"
                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Delete
              </Link>
            </div>
          </div>
        </td>
      </tr>
    );
  } else return null;
};
export default NoteRow;
