function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Annuler</button>
          <button onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

