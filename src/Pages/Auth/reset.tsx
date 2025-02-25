import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import './index.scss'
import input from '../../Component/Form/input'
import { Form, Row } from 'react-bootstrap'
import { newPassword } from '../../Store/Slice/auth'

function Reset() {
  const { state } = useLocation()
  const mail = state?.prevEmail
  const resetpassword = useAppSelector((state: any) => state.userDetails?.reset)
  const [userInfo, setuser] = useState<any>({
    email: '',
    newPassword: '',
  })
  const [errorShow, setErrorShow] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isSubmit, setIsSubmit] = useState(false)

  const validate = (values: any) => {
    const errors: any = {}
    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,15})/
    if (!values?.newPassword) {
      errors.newPassword = 'Password is required'
    } else if (!pass.test(values?.newPassword)) {
      errors.newPassword = 'Password be like (A-z)+(0-9)+@'
    }
    if (!values?.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required'
    } else if (values?.newPassword !== values?.confirmPassword) {
      errors.confirmPassword = 'Confirm Password does not match'
    }
    return errors
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setErrorShow(false)
    setuser({ ...userInfo, [name]: value })
  }

  const successMessage = resetpassword?.success

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setErrorShow(true)

    userInfo.email = mail
    if (Object.keys(formErrors).length === 0) {
      setIsSubmit(true)
      dispatch(newPassword(userInfo))
    } else setIsSubmit(false)
  }

  useEffect(() => {
    setFormErrors(validate(userInfo))
  }, [userInfo])

  useEffect(() => {
    if (successMessage && isSubmit) navigate('/')
  }, [successMessage])

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
          <h2 className='form-header'>Reset Password</h2>
          <h4 className='form-header'></h4>
          {input({
            handleChange,
            errorShow,
            type: 'password',
            value: userInfo.newPassword,
            errors: formErrors.newPassword,
            name: 'newPassword',
            label: 'New Password',
          })}
          {input({
            handleChange,
            errorShow,
            value: userInfo.confirmPassword,
            errors: formErrors.confirmPassword,
            name: 'confirmPassword',
            label: 'Confirm Password',
          })}
          <div className='buttons'>
            <button type='submit' className='submit -button'>
              Submit
            </button>
          </div>
        </Form>
      </Row>
    </div>
  )
}

export default Reset
