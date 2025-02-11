import { useState, useEffect } from "react";
import { ROLES } from "../../config/roles";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import AlertError from "../../components/AlertError";
import Spinner from "../../components/Spinner";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%~&*+-_!]{4,20}$/;

const EditUser = () => {
  useTitle("Add new User");
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [retypePassword, setRetypePassword] = useState("");
  const [validRetypePwd, setValidRetypePwd] = useState(false);

  const [formError, setFormError] = useState(false);

  const [roles, setRoles] = useState([ROLES.Employee]);
  const [validRoles, setValidRoles] = useState(true);

  const [active, setActive] = useState(false);

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
    roles.length,
    validUsername,
    validPassword,
    validRetypePwd,
    validRoles,
    !isLoading,
  ].every(Boolean);

  const handleSubmit = async (e) => {
    setFormError(false);
    e.preventDefault();

    if (!validPassword || !validUsername || !validRetypePwd || !validRoles) {
      setFormError(true);
      return;
    }

    if (canSave) {
      await addNewUser({ username, password, roles, active });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
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

  return (
    <div
      id="createNewUser"
      className="min-w-100 flex flex-col justify-center items-center"
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New User
            </h3>
          </div>
          {formError && <AlertError message={errorMsg()} />}
          {isError && <AlertError message={[error?.data?.error]} />}
          {isLoading ? (
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
                      value={active}
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
                  onClick={() => navigate("/dash/users")}
                  className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditUser;
