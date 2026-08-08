import PropTypes from 'prop-types';

function renderCellValue(column, row) {
  if (column.render) {
    return column.render(row[column.key], row);
  }
  return row[column.key];
}

function DataTable({ columns, data, onEdit, onDelete, onView }) {
  const hasActions = Boolean(onEdit || onDelete || onView);

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
          {hasActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key}>{renderCellValue(col, row)}</td>
            ))}
            {hasActions && (
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

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};

export default DataTable;

