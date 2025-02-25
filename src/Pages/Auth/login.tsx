import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import { signIn } from '../../Store/Slice/auth'
import { Form, Row } from 'react-bootstrap'
import input from '../../Component/Form/input'
import './index.scss'
function SignIn() {
  // const userDetails = useSelector((state) => state.userDetails);
  // const [userInfo, setuser] = useState(userDetails);
  const [userInfo, setuser] = useState<any>({
    email: '',
    password: '',
  })
  const store = useAppSelector((state: any) => state.userDetails)

  // userDetails.role = 'client';
  const [errorShow, setErrorShow] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  // const [isSubmit, setIsSubmit] = useState(false)

  const validate = (values: { email: string; password: string }) => {
    const errors: any = {}
    if (!values?.email) {
      errors.email = 'Email is required!'
    }
    if (!values?.password) {
      errors.password = 'Password is required'
    }
    return errors
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setErrorShow(false)
    setuser({ ...userInfo, [name]: value })
  }

  // const successMessage = store.getState().user.success;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setErrorShow(true)
    // if (Object.keys(formErrors).length === 0) navigate('/dashboard')
    if (Object.keys(formErrors).length === 0) {
      dispatch(signIn(userInfo))
      // navigate('/dashboard')
    }
  }

  useEffect(() => {
    setFormErrors(validate(userInfo))
  }, [userInfo])

  useEffect(() => {
    if (store?.user?.data?.token) {
      // log.info('navigate to Dashboard');
      navigate('/dashboard')
    }
  }, [store?.user])
  // useEffect(() => {
  //   if (successMessage && isSubmit) navigate('/dashboard');
  // }, [successMessage]);

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
          <h2 className='form-header'>Login</h2>
          <h4 className='form-header'>Please fill the required details to login</h4>
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
            value: userInfo.password,
            errors: formErrors.password,
            name: 'password',
            label: 'Password',
            // link: {
            //   to: '/forgot',
            //   name: 'Forgot password?',
            // },
          })}
          <button
            type='button'
            className='edit -button'
            onClick={() => navigate('/forgetpassword')}
          >
            Forgot password?
          </button>
          <div className='buttons'>
            <button type='submit' className='submit -button'>
              Login
            </button>
          </div>
          <button
            type='button'
            style={{ justifyContent: 'center' }}
            className='edit -button'
            onClick={() => navigate('/register')}
          >
            Create an Account?
          </button>
        </Form>
        {/* <div className='mobile-view' /> */}
      </Row>
    </div>
  )
}

export default SignIn
