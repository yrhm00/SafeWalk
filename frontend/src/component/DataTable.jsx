function DataTable({ columns, data, onEdit, onDelete, onView }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
          {(onEdit || onDelete || onView) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
            ))}
            {(onEdit || onDelete || onView) && (
              <td>
                {onView && <button onClick={() => onView(row)}>Voir</button>}
                {onEdit && <button onClick={() => onEdit(row)}>Éditer</button>}
                {onDelete && <button onClick={() => onDelete(row)}>Supprimer</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;

