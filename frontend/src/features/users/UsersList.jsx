import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

import { useGetUsersQuery } from "./usersApiSlice";
import AlertError from "../../components/AlertError";
import Spinner from "../../components/Public/Spinner";
import UserRow from "./UserRow";

import { Dropdown } from "flowbite";
import { useEffect } from "react";
import ListHeader from "../../components/Dash/ListHeader";
import ListFooter from "../../components/Dash/ListFooter";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;

  if (isLoading) {
    content = <Spinner />;
  }

  if (isError) {
    content = (
      <AlertError
        code={error?.originalStatus || "Unkown"}
        message={
          error?.error || error?.data?.message || "Something went wrong!"
        }
      />
    );
  }

  if (isSuccess) {
    const { ids } = users;

    const tabContent = ids?.length
      ? ids.map((userId) => <UserRow key={userId} userId={userId} />)
      : null;

    content = (
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <ListHeader entity="user" addLink="/dash/users/new" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Username
                </th>
                <th scope="col" className="px-4 py-3">
                  Roles
                </th>
                <th scope="col" className="px-4 py-3">
                  Active
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
  }, [users]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">{content}</div>
    </section>
  );
};
export default UsersList;
