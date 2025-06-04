import { useRef, useEffect } from 'react'
import CaseForm from './CaseForm'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const CaseModal = ({ onCreate }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const modal = new window.bootstrap.Modal(modalRef.current)
    modalRef.current.modalInstance = modal
  }, [])

  const openModal = () => {
    modalRef.current.modalInstance.show()
  }

  return (
    <>
      <button className="btn btn-primary mb-3" onClick={openModal}>
        Dodac sprawe
      </button>

      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nowa sprawa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div className="modal-body">
              <CaseForm onCreate={() => {
                modalRef.current.modalInstance.hide()
                if (onCreate) onCreate()
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CaseModal
