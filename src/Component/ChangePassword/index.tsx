import { useEffect, useState } from 'react'
import './index.scss'

function Change({ setShow }: { setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [userInfo, setuser] = useState<any>()
  const [errorShow, setErrorShow] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})

  const validate = (values: any) => {
    const errors: any = {}
    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,15})/
    if (!values?.password) {
      errors.password = 'Password is required'
    } else if (!pass.test(values?.password)) {
      errors.password = 'Password be like (A-z)+(0-9)+@'
    }
    if (!values?.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required'
    } else if (values?.password !== values?.confirmPassword) {
      errors.confirmPassword = 'Confirm Password does not match'
    }
    return errors
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setErrorShow(false)
    setuser({ ...userInfo, [name]: value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setErrorShow(true)
    if (Object.keys(formErrors).length === 0) setShow(false)
    // if (Object.keys(formErrors).length === 0) {
    //   dispatch(Forgot(userInfo));
    // } else setIsSubmit(false);
    // setIsSubmit(true);
  }

  useEffect(() => {
    setFormErrors(validate(userInfo))
  }, [userInfo])

  return (
    <div onClick={() => setShow(false)} className='changepassword'>
      <div onClick={(e) => e.stopPropagation()} className='wrap'>
        <form onSubmit={handleSubmit}>
          <h2 className='formTitle'>Change Your Password</h2>
          <div className='form-body'>
            <div className={`password ${!errorShow || !formErrors.password}`}>
              <label className='form__label'>Password </label>
              <input
                name='password'
                onChange={handleChange}
                type='password'
                className='form__input'
              />
            </div>
            {errorShow && <p className='text-danger'>{formErrors.password}</p>}
            <div className={`confirmPassword ${!errorShow || !formErrors.confirmPassword}`}>
              <label className='form__label'>Confirm Password </label>
              <input
                name='confirmPassword'
                onChange={handleChange}
                type='password'
                className='form__input'
              />
            </div>
            {errorShow && <p className='text-danger'>{formErrors.confirmPassword}</p>}
          </div>
          <div className='buttonWrapper'>
            <button type='submit' className='submitButton'>
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Change
