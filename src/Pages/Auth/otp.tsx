import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, Row } from 'react-bootstrap'
import './index.scss'
import { OTP, forgotPassword } from '../../Store/Slice/auth'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import OtpInput from 'react-otp-input'

function Otp() {
  const { state } = useLocation()

  const prevEmail = state?.userInfo?.email
  const [errorShow, setErrorShow] = useState(false)
  const [userInfo, setuser] = useState<{ otp: string; email: string }>({
    otp: '',
    email: state?.userInfo?.email,
  })
  const [formErrors, setFormErrors] = useState<any>({})
  const [isSubmit, setIsSubmit] = useState(false)
  const [timer, setTimer] = useState(30)
  const [otp, setOtp] = useState<any>('')
  const store = useAppSelector((state: any) => state.userDetails?.otp)
  const successMessage = store?.success
  const regex: any = /^([0-9]{6})+$/

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (e: any) => {
    const name = 'otp'
    setOtp(e)
    setErrorShow(false)
    setuser({ ...userInfo, [name]: e })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setErrorShow(true)
    if (Object.keys(formErrors).length === 0) {
      dispatch(OTP(userInfo))
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }
  const validateOtp = (values: { otp: string; email?: string }) => {
    const errors: any = {}
    if (!values.otp) {
      errors.otp = 'OTP required!'
    } else if (values.otp.length < 6) {
      errors.otp = 'OTP length must be 6!'
    } else if (!regex.test(values.otp)) {
      errors.otp = 'Only numbers are allowed'
    }
    return errors
  }
  const timeOutCallback = useCallback(() => setTimer((currTimer) => currTimer - 1), [])
  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000)
  }, [timer, timeOutCallback])

  const resetTimer = () => {
    if (!timer || timer === 0) {
      // log.info('Reset OTP');
      dispatch(forgotPassword({ email: prevEmail }))
      setTimer(30)
      setIsSubmit(false)
    }
  }

  const inputStyle = {
    width: '3rem',
    fontSize: 'large',
    boxShadow: '0px 0px 2px 0px #838383 ',
    border: 'none',
    padding: '10px 0',
  }
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  useEffect(() => {
    setFormErrors(validateOtp(userInfo))
  }, [userInfo])

  useEffect(() => {
    if (successMessage && isSubmit) {
      // log.info('OTP verified');
      navigate('/reset', {
        state: {
          prevEmail,
        },
      })
    }
  }, [successMessage])

  return (
    <div className='forgot-password-page'>
      <Row className='image-half' />
      <Row className='form-half'>
        <p className='flex small-device-error'>This Device is too small...</p>
        <Form className='form' onSubmit={handleSubmit}>
          <h2 className='form-header'>OTP Verification</h2>
          <h4 className='form-header'>OTP Has Been sent on {prevEmail}</h4>
          <div>
            <label htmlFor='otp'>Enter OTP</label>
            <OtpInput
              containerStyle={containerStyle}
              inputStyle={inputStyle}
              value={otp}
              onChange={(e) => {
                handleChange(e)
              }}
              numInputs={6}
              //   renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
            />
            <p className='text-danger'>{errorShow ? formErrors.otp : null}</p>
          </div>
          <div className='otp-timer'>{timer !== 0 && `Resend OTP in ${timer}s`}</div>

          <div>
            <button type='submit' className='submit -button'>
              Verify
            </button>
          </div>
          <div className='resend-otp'>
            Didn&apos;t Receive the OTP?
            <Button className='under-line' disabled={timer !== 0} onClick={resetTimer}>
              Resend OTP
            </Button>
          </div>
        </Form>
      </Row>
    </div>
  )
}

export default Otp
