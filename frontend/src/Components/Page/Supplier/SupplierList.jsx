import React from "react";

const SupplierList = ({ suppliers, listItemRefs, onKeyDown }) => (
  <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    {suppliers.map((s, index) => (
      <li
        key={s.id}
        tabIndex={0}
        ref={(el) => (listItemRefs.current[index] = el)}
        onKeyDown={(e) => onKeyDown(e, index)}
        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100 dark:focus:bg-blue-600 transition-colors cursor-pointer rounded"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{index + 1}.</span>
          <span className="font-medium">{s.name}</span>
        </div>
      </li>
    ))}
  </ul>
);

export default SupplierList;
