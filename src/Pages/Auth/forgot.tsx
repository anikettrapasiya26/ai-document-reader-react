import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../Store/Slice/auth'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import { Form, Row } from 'react-bootstrap'
import input from '../../Component/Form/input'
import './index.scss'

function Forgot() {
  const userDetails = useAppSelector((state: any) => state.userDetails.forgot)
  const [userInfo, setuser] = useState<any>({
    email: '',
  })
  const [errorShow, setErrorShow] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  // const [method, setMethod] = useState('email')

  const validate = (values: { email: string; password: string }) => {
    const errors: any = {}
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    if (!values?.email) {
      errors.email = 'Email is required!'
    } else if (!regex.test(values?.email)) {
      errors.email = 'This is not a valid email format!'
    }
    return errors
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setErrorShow(false)
    setuser({ ...userInfo, [name]: value })
  }

  const successMessage = userDetails?.success

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setErrorShow(true)
    if (Object.keys(formErrors).length === 0) {
      dispatch(forgotPassword(userInfo))
      setIsSubmit(true)
    } else setIsSubmit(false)
  }

  useEffect(() => {
    setFormErrors(validate(userInfo))
  }, [userInfo])

  useEffect(() => {
    if (successMessage && isSubmit)
      navigate('/otp', {
        state: {
          userInfo,
        },
      })
  }, [successMessage, isSubmit])

  return (
    <div className='forgot-password-page'>
      <Row className='image-half' />
      <Row className='form-half'>
        <p className='flex small-device-error'>This Device is too small...</p>
        <Form className='form' onSubmit={handleSubmit}>
          <h2 className='form-header'>Forgot Password</h2>
          <h4 className='form-header'></h4>
          {
            // method === 'email' &&
            input({
              handleChange,
              errorShow,
              value: userInfo.email,
              errors: formErrors.email,
              name: 'email',
              label: 'Email',
            })
          }
          {/* {method === 'phone' &&
            input({
              handleChange,
              errorShow,
              value: userInfo.phone,
              errors: formErrors.phone,
              name: 'phone',
              label: 'Phone Number',
            })} */}
          <button style={{ marginTop: '10px' }} type='submit' className='submit -button'>
            Get OTP
          </button>
          {/* <Button
            type='button'
            className='under-line'
            onClick={() => {
              setuser({
                email: '',
              })
              if (method === 'email') {
                setMethod('phone')
              } else setMethod('email')
            }}
          >
            {`With ${method === 'email' ? 'Phone Number' : 'Email'}`}
          </Button> */}
        </Form>
      </Row>
    </div>
  )
}

export default Forgot
