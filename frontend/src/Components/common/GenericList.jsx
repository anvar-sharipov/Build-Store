const GenericList = ({ data, renderItem, emptyMessage = "Нет данных" }) => {
  if (!data || data.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <ul>
      {data.map((item, index) => (
        <li key={item.id || index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

export default GenericList;
