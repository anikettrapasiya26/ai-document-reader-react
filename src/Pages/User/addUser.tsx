import { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'

import input from '../../Component/Form/input'
import { addUser } from '../../Store/Slice/client'
import { useAppDispatch, useAppSelector } from '../../Store/type'
// import { addUser } from '../../Stores/Action';
import './index.scss'

function AddUser(props: { onHide: any; show: boolean }) {
  const { onHide } = props
  const clinetData = useAppSelector((state: any) => state.clients?.clients)
  const successMessage = clinetData?.success
  const dispatch = useAppDispatch()

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  }

  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState<any>({})
  const [errorShow, setErrorShow] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  // const [employeeName, setEmployeeName] = useState('');

  const addUserData = async () => {
    const formData = new FormData()
    formData.append('first_name', formValues.first_name)
    formData.append('last_name', formValues.last_name)
    formData.append('email', formValues.email)
    formData.append('phone', formValues.phone)
    dispatch(addUser(formData))
  }
  const validate = (values: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }) => {
    const errors: any = {}
    const Name = /^[A-Za-z ]*$/
    const Phone = /^(([1-9]{2,4})[ -]*)*?[0-9]{3,6}?[ -]*[0-9]{3,6}?$/
    const regex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})/
    // const gstNumber = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
    // const panNumber = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;

    if (!values.first_name) {
      errors.first_name = 'First Name is required!'
    } else if (!Name.test(values.first_name)) {
      errors.first_name = 'This is not a valid Name format!'
    }
    if (!values.last_name) {
      errors.last_name = 'Last Name is required!'
    } else if (!Name.test(values.last_name)) {
      errors.last_name = 'This is not a valid Name format!'
    }
    if (!values.email) {
      errors.email = 'email is required'
    } else if (!regex.test(values.email)) {
      errors.email = 'This email is not valid!'
    }

    if (!values.phone) {
      errors.phone = 'Phone is required'
    } else if (values.phone.length < 10) {
      errors.phone = 'Phone cannot exceed less than 10 characters'
    } else if (values.phone.length > 10) {
      errors.phone = ' Phone number is not correct'
    } else if (!Phone.test(values.phone)) {
      errors.phone = 'This is not a valid GST format!'
    }
    return errors
  }
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setErrorShow(false)
    setIsSubmit(false)
    setFormValues({ ...formValues, [name]: value })
  }

  useEffect(() => {
    setFormErrors(validate(formValues))
  }, [formValues])
  const handleHide = async () => {
    setFormErrors(false)
    onHide()
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setFormErrors(validate(formValues))
    setErrorShow(true)
    if (Object.keys(formErrors).length === 0) {
      setIsSubmit(true)
      addUserData()
      setErrorShow(false)
      setFormErrors('')
    }
  }

  useEffect(() => {
    if (isSubmit && successMessage) {
      window.alert('User Added Successfully')
      onHide()
    }
  })

  return (
    <div onClick={() => handleHide()} className='profile_section'>
      <div onClick={(e) => e.stopPropagation()} className='wrap'>
        <Form id='userdetail' onSubmit={handleSubmit}>
          <div className='userHeader'>
            <h2
              style={{
                fontWeight: 'bolder',
                color: 'GrayText',
              }}
            >
              Add User
            </h2>
          </div>

          {input({
            handleChange,
            errorShow,
            value: formValues.first_name,
            errors: formErrors.first_name,
            name: 'first_name',
            label: 'First Name',
            maxLength: 50,
          })}

          {input({
            handleChange,
            errorShow,
            value: formValues.last_name,
            errors: formErrors.last_name,
            name: 'last_name',
            label: 'Last Name',
            maxLength: 50,
          })}

          {input({
            handleChange,
            errorShow,
            value: formValues.email,
            errors: formErrors.email,
            name: 'email',
            label: 'Email',
          })}
          {input({
            handleChange,
            errorShow,
            value: formValues.phone,
            errors: formErrors.phone,
            name: 'phone',
            label: 'Phone Number',
            maxLength: 10,
          })}
          <div className='userFooter'>
            <Button className='submitButton' type='submit' id='submit-button'>
              Add
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddUser
