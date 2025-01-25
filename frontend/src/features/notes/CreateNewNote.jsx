import { selectAllUsers } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useState, useEffect } from "react";

import AlertError from "../../components/AlertError";

const CreateNewNote = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => selectAllUsers(state));
  const [addNewNote, { isSuccess, isError, isLoading, error }] =
    useAddNewNoteMutation();

  const [title, setTitle] = useState("");
  const [validTitle, setValidTitle] = useState(false);

  const [owner, setOwner] = useState("Select Owner...");
  const [validOwner, setValidOWner] = useState(false);

  const [description, setDescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);

  const [formError, setFormError] = useState(false);

  const [completed, setCompleted] = useState(false);

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

  const options = users
    .filter((user) => user.active)
    .map((currUser) => {
      return (
        <option key={currUser.username} value={currUser.username}>
          {currUser.username}
        </option>
      );
    });

  const canSave = [validTitle, validDescription, validOwner, !isLoading].every(
    Boolean
  );

  const handleSubmit = async (e) => {
    setFormError(false);
    e.preventDefault();

    if (!canSave) {
      setFormError(true);
      return;
    }
    await addNewNote({ title, text: description, username: owner, completed });
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
        .filter((user) => user.active)
        .map((user) => user.username)
        .includes(owner)
    );
  }, [owner, users]);

  useEffect(() => {
    setFormError(false);
  }, [title, description, owner]);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setCompleted(false);
      setOwner("Select Owner...");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  return (
    <div
      id="createNote"
      className="min-w-100 flex flex-col justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto justify-center items-center">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Note
            </h3>
          </div>
          {formError && <AlertError message={errorMsg()} />}
          {isError && <AlertError message={[error?.data?.error]} />}

          {users || isLoading ? (
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
                    placeholder="Write a title..."
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
                    <option value="Select Owner...">Select owner...</option>
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
                      checked={completed}
                      onChange={() => setCompleted((prev) => !prev)}
                      type="checkbox"
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
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dash/notes")}
                  className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};
export default CreateNewNote;
