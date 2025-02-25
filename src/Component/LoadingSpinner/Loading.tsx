import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import './loadingSpinner.scss'
// import { ProgressBar } from 'react-bootstrap'

function LoadingSpinner(props: any) {
  // const { progress } = props
  return (
    <Modal
      {...props}
      backdropClassName='back-drop-loader'
      dialogClassName='modal-loader'
      // className="plant-modal"
      size='sm'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    />
  )
}

export default LoadingSpinner
