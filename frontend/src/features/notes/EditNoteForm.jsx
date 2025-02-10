import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";

import { Modal } from "flowbite";

import AlertError from "../../components/AlertError";
import Spinner from "../../components/Spinner";

import { useDeleteNoteMutation, useUpdateNoteMutation } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";

import useAuth from "../../hooks/useAuth";

import DeleteItem from "../../components/Dash/DeleteItem";

const EditNoteForm = ({ note }) => {
  const { isAdmin, isManager, username } = useAuth();
  const navigate = useNavigate();
  const users = useSelector((state) => selectAllUsers(state));

  const [updateNote, { isSuccess, isLoading, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    {
      isSuccess: isDelSuccess,
      isLoading: isDelLoading,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteNoteMutation();

  const [title, setTitle] = useState(note?.title);
  const [validTitle, setValidTitle] = useState(false);

  const [owner, setOwner] = useState(note?.user?.username);
  const [validOwner, setValidOWner] = useState(false);

  const [description, setDescription] = useState(note?.text);
  const [validDescription, setValidDescription] = useState(false);

  const [formError, setFormError] = useState(false);

  const [completed, setCompleted] = useState(note?.completed);

  let filteredUsers;

  if (isManager || isAdmin) {
    filteredUsers = users.filter((user) => user.active);
  } else {
    filteredUsers = [{ username }];
  }

  const options = filteredUsers.map((currUser) => {
    return (
      <option key={currUser.username} value={currUser.username}>
        {currUser.username}
      </option>
    );
  });

  console.log(users);

  const errorMsg = () => {
    let output = [];
    if (!validTitle) {
      output.push(
        "Title must have more than 10 characters and less than 255 characters !"
      );
    }

    if (!validDescription) {
      output.push("Description must have at least 20 characters!");
    }

    if (!validOwner) {
      output.push("Please choose a valid owner from the list!");
    }

    return output;
  };

  const canSave = [validTitle, validDescription, validOwner, !isLoading].every(
    Boolean
  );

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const deleteRef = useRef();

  const handleSubmit = async (e) => {
    setFormError(false);
    e.preventDefault();

    if (!canSave) {
      setFormError(true);
      return;
    }

    await updateNote({
      ticket: note?.ticket,
      title,
      text: description,
      username: owner,
      completed,
    });
  };

  useEffect(() => {
    setValidTitle(title.length >= 10 && title.length <= 255);
  }, [title]);

  useEffect(() => {
    setValidDescription(description.length >= 20);
  }, [description]);

  useEffect(() => {
    setValidOWner(
      users
        .filter((user) => user.active || user.username === note?.user?.username)
        .map((user) => user.username)
        .includes(owner)
    );
  }, [note, owner, users]);

  useEffect(() => {
    setFormError(false);
  }, [title, description, owner]);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setOwner("null");
      setCompleted(false);
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    // set the modal menu element
    const $modalTargetEl = document.getElementById("deleteModal");

    // options with default values
    const modalOptions = {
      placement: "bottom-right",
      backdrop: "dynamic",
      backdropClasses:
        "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 deleteModalBackDrop",
      closable: true,
    };

    // instance options object
    const modalInstanceOptions = {
      id: "deleteModal",
      override: true,
    };

    const modal = new Modal($modalTargetEl, modalOptions, modalInstanceOptions);

    deleteRef.current?.addEventListener("click", () => {
      const backdrop = document.querySelector(".deleteModalBackDrop");
      if (!backdrop) {
        const backdropHTML = document.createElement("div");
        backdropHTML.classList.add(
          "bg-gray-900/50",
          "dark:bg-gray-900/80",
          "fixed",
          "inset-0",
          "z-40",
          "deleteModalBackDrop"
        );
        document.body.appendChild(backdropHTML);
      }

      modal.show();
    });
  }, []);

  return (
    <div
      id="editNote"
      className="min-w-100 flex flex-col justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto justify-center items-center">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Note
            </h3>
          </div>
          {formError && <AlertError message={errorMsg()} />}
          {isError && (
            <AlertError message={[error?.data?.error]} dismissible={true} />
          )}
          {isDelError && (
            <AlertError message={[delError?.data?.error]} dismissible={true} />
          )}

          {isLoading || isDelLoading ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="owner"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Owner
                  </label>
                  <select
                    id="owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    {options}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="completed"
                    className="inline-flex items-center mb-5 cursor-pointer"
                  >
                    <input
                      id="completed"
                      name="completed"
                      type="checkbox"
                      checked={completed}
                      onChange={() => setCompleted((prev) => !prev)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Completed
                    </span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Update Note
                </button>
                {(isAdmin || isManager) && (
                  <button
                    type="button"
                    ref={deleteRef}
                    className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    <svg
                      className="mr-1 -ml-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Delete Note
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      <DeleteItem
        item="note"
        itemTitle={note?.title}
        handleAction={onDeleteNoteClicked}
        isDelSuccess={isDelSuccess}
        isDelError={isDelError}
      />
    </div>
  );
};
export default EditNoteForm;
