import { Dismiss } from "flowbite";
import { useEffect } from "react";

const AlertError = ({ code = "", message, dismissible = false }) => {
  useEffect(() => {
    const $targetEl = document.getElementById("alert-fetch-error");

    const options = {
      transition: "transition-opacity",
      duration: 1000,
      timing: "ease-out",
    };

    // instance options object
    const instanceOptions = {
      id: "alert-fetch-error",
      override: true,
    };

    const alert = new Dismiss($targetEl, null, options, instanceOptions);

    if (dismissible) {
      const timeoutId = setTimeout(() => alert.hide(), 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [dismissible]);

  return (
    <div
      id="alert-fetch-error"
      className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">Error {code}</h3>
      </div>
      <ul className="mt-2 mb-4 text-sm list-disc list-inside">
        {message?.map((msg, key) => (
          <li key={`msg-${key}`}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};
export default AlertError;
