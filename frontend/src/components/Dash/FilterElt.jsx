const FilterElt = ({ filterElt }) => {
  return (
    <li className="flex items-center">
      <input
        id={filterElt.toLowerCase()}
        type="checkbox"
        value=""
        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor={filterElt.toLowerCase()}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {filterElt}
      </label>
    </li>
  );
};
export default FilterElt;
