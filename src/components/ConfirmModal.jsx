import Modal from './Modal';

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} width={420}>
      <div className="confirm-body">
        <p>{message}</p>
        <div className="confirm-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
