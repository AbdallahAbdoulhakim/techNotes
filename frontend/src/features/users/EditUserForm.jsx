import { ROLES } from "../../config/roles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AlertError from "../../components/AlertError";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import DeleteItem from "../../components/Dash/DeleteItem";
import { Modal } from "flowbite";
import Spinner from "../../components/Spinner";

const EditUserForm = ({ user }) => {
  const [username, setUsername] = useState(user?.username);
  const [validUsername, setValidUsername] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [retypePassword, setRetypePassword] = useState("");
  const [validRetypePwd, setValidRetypePwd] = useState(false);

  const [formError, setFormError] = useState(false);

  const [roles, setRoles] = useState(user?.roles);
  const [validRoles, setValidRoles] = useState(true);

  const [active, setActive] = useState(user?.active);

  const [updateUser, { isSuccess, isLoading, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    {
      isSuccess: isDelSuccess,
      isLoading: isDelLoading,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const errorMsg = () => {
    let output = [];
    if (!validPassword) {
      output.push(
        "Password must have 4 to 20 alphanumeric or special characters (@#$%~&*+-_!)!"
      );
    }

    if (!validUsername) {
      output.push("Username must have 3 to 20 alphanumeric characters!");
    }

    if (!validRetypePwd) {
      output.push("Passwords do not match!");
    }

    if (!validRoles) {
      output.push("You must a least select a role!");
    }

    return output;
  };

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setRoles(values);
  };

  const canSave = [
    validRoles,
    validUsername,
    !password || (validPassword && validRetypePwd),
  ].every(Boolean);

  const handleSubmit = async (e) => {
    setFormError(false);
    e.preventDefault();

    if (!canSave) {
      setFormError(true);
      return;
    }

    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  useEffect(() => {
    const USER_REGEX = /^[A-z0-9]{3,20}$/;
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    const PWD_REGEX = /^[A-z0-9!@#$%~&*+-_!]{4,20}$/;
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidRoles(roles.length);
  }, [roles]);

  useEffect(() => {
    setValidRetypePwd(password === retypePassword);
  }, [password, retypePassword]);

  useEffect(() => {
    setFormError(false);
  }, [password, retypePassword, username]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRetypePassword("");
      setRoles([]);
      setActive(false);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const deleteRef = useRef();

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
      id="editUser"
      className="min-w-100 flex flex-col justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit User
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
              <div className="grid gap-4 mb-4">
                <div>
                  <label
                    htmlFor="username"
                    className={`block mb-2 text-sm font-medium ${
                      formError && !validUsername
                        ? "text-red-700 dark:text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    id="username"
                    value={username}
                    className={`border text-sm rounded-lg block w-full p-2.5 ${
                      formError && !validUsername
                        ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 text-sm  focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50  border-gray-300 text-gray-900  focus:ring-primary-600 focus:border-primary-600  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    }`}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className={`block mb-2 text-sm font-medium ${
                      formError && !validPassword
                        ? "text-red-700 dark:text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    className={`border text-sm rounded-lg block w-full p-2.5 ${
                      formError && !validPassword
                        ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 text-sm  focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50  border-gray-300 text-gray-900  focus:ring-primary-600 focus:border-primary-600  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    }`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="repeat-password"
                    className={`block mb-2 text-sm font-medium ${
                      formError && !validRetypePwd
                        ? "text-red-700 dark:text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Retype password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="repeat-password"
                    value={retypePassword}
                    className={`border text-sm rounded-lg block w-full p-2.5 ${
                      formError && !validRetypePwd
                        ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 text-sm  focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        : "bg-gray-50  border-gray-300 text-gray-900  focus:ring-primary-600 focus:border-primary-600  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    }`}
                    onChange={(e) => setRetypePassword(e.target.value)}
                  />
                </div>
                <div>
                  <fieldset>
                    <label
                      htmlFor="roles"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select roles:
                    </label>
                    <select
                      name="roles"
                      id="roles"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={roles}
                      multiple={true}
                      size="3"
                      onChange={onRolesChanged}
                    >
                      {options}
                    </select>
                  </fieldset>
                </div>
                <div>
                  <label
                    htmlFor="active"
                    className="inline-flex items-center mb-5 cursor-pointer"
                  >
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      className="sr-only peer"
                      checked={active}
                      onChange={() => setActive((prev) => !prev)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Save User
                </button>
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
                  Delete User
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <DeleteItem
        item="user"
        itemTitle={user?.username}
        handleAction={onDeleteUserClicked}
        isDelSuccess={isDelSuccess}
        isDelError={isDelError}
      />
    </div>
  );
};
export default EditUserForm;
