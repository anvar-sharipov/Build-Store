// components/MyList.jsx
const MyList = ({ items, getKey, renderItem }) => {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

export default MyList;
