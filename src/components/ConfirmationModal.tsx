import React from 'react'

interface ConfirmationModalProps {
  id: string
  title: string
  message: string
  onConfirm: () => void
}

const closeModal = (id: string) => {
  const modalElement: any = document.getElementById(id)
  modalElement.close()
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id,
  title,
  message,
  onConfirm,
}) => {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            className="btn btn-primary outline-none"
            data-testid="modal-confirm"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button className="btn btn-neutral" onClick={() => closeModal(id)}>
            No
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmationModal
