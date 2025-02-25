import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import { signUp } from '../../Store/Slice/auth'
import { Form, Row } from 'react-bootstrap'
import input from '../../Component/Form/input'

function Register() {
  const [userInfo, setuser] = useState<any>({})
  const [errorShow, setErrorShow] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const success = useAppSelector((state: any) => state.userDetails.user)
  const successMessage = success?.success

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setErrorShow(false)
    setuser({ ...userInfo, [name]: value })
  }

  const validate = (values: any) => {
    const errors: any = {}
    const name = /^[A-Za-z ]+[A-Za-z0-9 ]?$/
    const email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,15})/
    const phone = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    if (values?.email) {
      if (!email.test(values?.email)) errors.email = 'This is not a valid email format!'
    } else errors.email = 'Email is required!'
    if (values?.password) {
      if (!pass.test(values?.password))
        errors.password = 'Password must have 0-9,a-z,A-Z and special charector'
    } else errors.password = 'Password is required'
    if (values?.name) {
      if (!name.test(values?.name)) errors.name = 'name is invalid'
    } else errors.name = 'Name is required'

    if (values?.phone) {
      if (!phone.test(values?.phone)) errors.phone = 'Phone number is invalid'
    } else errors.phone = 'Phone number is required'
    return errors
  }

  useEffect(() => {
    setFormErrors(validate(userInfo))
  }, [userInfo])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setErrorShow(true)
    if (Object.keys(formErrors).length === 0) {
      dispatch(signUp(userInfo))
    }
  }

  useEffect(() => {
    if (successMessage) {
      navigate('/')
    }
  }, [successMessage])
  // const navigate = useNavigate()
  return (
    <div className='login-page'>
      {/* className="login-page" */}
      <Row className='image-half' />
      {/* className="image-half" */}
      <Row className='form-half'>
        {/* className="flex form-half" */}
        {/* <img className="logo-image" src="" alt="" /> */}
        <p className='flex small-device-error'>This Device is too small...</p>
        <Form className='form' onSubmit={handleSubmit}>
          <h2 className='form-header'>Register</h2>
          <h4 className='form-header'>Please fill the required details to register</h4>
          {input({
            handleChange,
            errorShow,
            value: userInfo.name,
            errors: formErrors.name,
            name: 'name',
            label: 'Full Name',
          })}
          {input({
            handleChange,
            errorShow,
            value: userInfo.email,
            errors: formErrors.email,
            name: 'email',
            label: 'Email',
          })}
          {input({
            handleChange,
            errorShow,
            value: userInfo.phone,
            errors: formErrors.phone,
            name: 'phone',
            label: 'Mobile No.',
            maxLength: 10,
          })}
          {input({
            handleChange,
            errorShow,
            value: userInfo.password,
            errors: formErrors.password,
            name: 'password',
            label: 'Password',
          })}
          <div className='buttons'>
            <button type='submit' className='submit -button'>
              Register
            </button>
          </div>
          <button type='button' className='edit -button' onClick={() => navigate('/')}>
            Login To Your Account?
          </button>
        </Form>
        {/* <div className='mobile-view'/> */}
      </Row>
    </div>
  )
}

export default Register
