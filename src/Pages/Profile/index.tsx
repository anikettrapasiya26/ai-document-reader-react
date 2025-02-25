import { useState, useEffect } from 'react'
import { Form, CloseButton } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import { resetPassword, updateProfile } from '../../Store/Slice/user'
import './index.scss'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import input from '../../Component/Form/input'
import { logOut } from '../../Store/Slice/auth'
import LoadingSpinner from '../../Component/assets/logo.gif'

function Userprofile(props: any) {
  const dispatch = useAppDispatch()
  const [singleFile, setSingleFile] = useState<any>('')
  const [preview, setpreview] = useState<any>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [pass, setPass] = useState<boolean>(true)

  const userState = useAppSelector((state: any) => state.user?.usersProfile)
  const data = userState?.data || {}
  const successMessage = userState?.success
  const resetPasswords = useAppSelector((state: any) => state.user?.resetPassword)
  const resetPasswordSuccess = resetPasswords?.success
  const updateProfiles = useAppSelector((state: any) => state.user?.updateProfile)
  const updateProfileLoading = updateProfiles?.isLoading

  const { onHide } = props

  const [profileimage, setprofileimage] = useState<any>('')
  useEffect(() => {
    setprofileimage(data?.profileUrl)
  }, [profileimage])

  useEffect(() => {
    data?.profileUrl ? setpreview(profileimage) : setpreview(undefined)
  }, [profileimage])
  const [formValues, setFormValues] = useState<any>({})
  const [formErrors, setFormErrors] = useState<any>({})
  const [passErrors, setPassErrors] = useState<any>({})
  const [disable, setDisabled] = useState<boolean>(true)
  const [show, setShow] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)
  const [profileType, setprofileType] = useState<any>('')
  const [profileerrorMsg, setProfileErrorMsg] = useState('')

  const SingleFileChange = (e: any) => {
    setSingleFile(e.target.files[0])
    setprofileType(e.target.files[0].type)
  }
  useEffect(() => {
    setFormValues({
      name: data?.name,
      phone: data?.phone,
      password: '********',
      profileUrl: data?.profileUrl,
    })
  }, [data])
  const updateProfileData = async () => {
    const formData = new FormData()

    formData.append('name', formValues.name)
    formData.append('phone', formValues.phone)
    singleFile.type && formData.append('file', formValues.profileUrl)
    dispatch(updateProfile(formData))
  }
  const validate = (values: { name?: any; email?: any; phone: any; profileUrl?: any }) => {
    const errors: any = {}
    const Name = /^[A-Za-z ]*$/

    const Phone = /^(([1-9]{2,4})[ -]*)*?[0-9]{3,6}?[ -]*[0-9]{3,6}?$/
    if (!values.name) {
      errors.name = 'First Name is required!'
    } else if (!Name.test(values.name)) {
      errors.name = 'This is not a valid Name format!'
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
  const passValidate = (values: { password: string }) => {
    const errors: any = {}
    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,15})/

    if (values?.password.length < 8) {
      errors.password = 'minimum 8 character required'
    } else if (values?.password) {
      if (!pass.test(values?.password))
        errors.password = 'must use 0-9,a-z,A-Z and special charector'
    } else errors.password = 'Password is required'

    return errors
  }

  useEffect(() => {
    if (!singleFile) {
      setpreview(undefined)
      return
    }
    setFormValues({ ...formValues, ['profileUrl']: singleFile })
    const objectUrl: any = URL.createObjectURL(singleFile)
    setpreview(objectUrl)
  }, [singleFile])

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }
  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setFormErrors(validate(formValues))
    setIsSubmit(true)
    setShow(!show)
  }
  const handlePassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setPassErrors(passValidate(formValues))
    setIsSubmit(true)
  }
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      if (
        profileType &&
        !(
          profileType === 'image/jpeg' ||
          profileType === 'image/jpg' ||
          profileType === 'image/png' ||
          profileType === 'image/gif'
        )
      ) {
        setProfileErrorMsg('Please! Select Valid Profile Photo')
        return
      }
      setVisible(!visible)
      setDisabled(true)
      updateProfileData()
      // setIsSubmit(false)
      // setProfileErrorMsg('Please! Select Valid Profile Photo')
    }
  }, [formErrors])

  useEffect(() => {
    if (Object.keys(passErrors).length === 0 && isSubmit) {
      dispatch(resetPassword({ newPassword: formValues.password }))
      // setPass(true)
    }
  }, [passErrors])
  useEffect(() => {
    if (successMessage && isSubmit) {
      // onHide()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  })

  useEffect(() => {
    if (resetPasswordSuccess && isSubmit) {
      setDisabled(true)
      setPass(true)
      // onHide()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [resetPasswordSuccess])
  const handleHide = async () => {
    setFormErrors(false)
    onHide()
    setProfileErrorMsg('')
    setDisabled(true)
    setVisible(true)
    setIsSubmit(false)
  }
  const handleReset = () => {
    setPass(!pass)
    setFormValues({ ...formValues, password: pass ? '' : '********' })
  }

  const ImageAvailable = (
    <img
      className='in-image'
      src={updateProfileLoading ? LoadingSpinner : preview}
      alt='Update preview'
    />
  )
  const notProfile = <div className='___image' />

  const profilePhoto = preview ? ImageAvailable : notProfile

  return (
    <Modal
      {...props}
      backdropClassName='back-drop-profile'
      dialogClassName='modal-profile'
      // className="plant-modal"
      style={{
        height: '100vh',
        padding: 0,
      }}
      size='sm'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      onHide={handleHide}
    >
      <Modal.Body
        style={{
          display: 'block',
          padding: '1.5rem',
          height: '100%',
        }}
      >
        <div className='profileHeader'>
          {visible ? (
            <button
              type='button'
              className='edit-button'
              onClick={() => {
                setShow(!show)
                setDisabled(!disable)
                setVisible(!visible)
              }}
            >
              <img className='edit-img' />
            </button>
          ) : (
            <button
              type='button'
              className='cancel-btn'
              onClick={() => {
                setShow(!show)
                setProfileErrorMsg('')
                setDisabled(!disable)
                setVisible(!visible)
              }}
            >
              <img className='cancel-img' />
            </button>
          )}
          <CloseButton style={{ float: 'right' }} onClick={handleHide} />
        </div>
        <Form method='POST' id='userprofile' onSubmit={handleSubmit}>
          <div className='profile-image' style={{ display: 'flex' }}>
            <label htmlFor='photo-upload' className='__image'>
              <div>
                {!disable ? (
                  <input
                    id='photo-upload'
                    className='in-image'
                    type='file'
                    accept='.svg,.png,.jpg,.jpeg,.gif'
                    style={{ display: 'none' }}
                    onChange={SingleFileChange}
                  />
                ) : (
                  <div />
                )}
                {profilePhoto}
                {profileerrorMsg && (
                  <p style={{ fontSize: 'x-small' }} className='errorMsg'>
                    {profileerrorMsg}
                  </p>
                )}
                {disable ? (
                  <span className='prevName'>{formValues.name}</span>
                ) : (
                  input({
                    handleChange,
                    errorShow: isSubmit,
                    value: formValues.name,
                    className: 'full-name',
                    errors: formErrors.name,
                    name: 'name',
                    label: 'Name',
                    disabled: disable,
                    maxLength: 50,
                  })
                )}
                {/* {!disable && <div className='camera' />} */}
              </div>
            </label>
          </div>

          <div className='email-phone'>
            {/* <div className={`email ${!errorShow || !formErrors.email}`}>
              <label className='form__label'>Email </label>
              <input name='email' onChange={(e: any) => handleChange(e)} type='text' className='form__input' />
            </div>
            {errorShow && <p className='text-danger'>{formErrors.email}</p>}
            <div className={`phone ${!errorShow || !formErrors.phone}`}>
              <label className='form__label'>Phone </label>
              <input name='phone' onChange={(e: any) => handleChange(e)} type='text' className='form__input' />
            </div>
            {errorShow && <p className='text-danger'>{formErrors.phone}</p>} */}

            {input({
              handleChange,
              errorShow: isSubmit,
              className: 'email',
              value: data?.email,
              name: 'email',
              label: 'Email',
              disabled: true,
            })}

            {input({
              handleChange,
              errorShow: isSubmit,
              value: formValues.phone,
              className: 'phone',
              errors: formErrors.phone,
              name: 'phone',
              label: 'Phone Number',
              disabled: disable,
              maxLength: 10,
            })}
          </div>
          <div className='email-phone'>
            <div className='flex form-input-controller'>
              <button type='button' onClick={() => handleReset()} className='close close-btn'>
                {/* {pass ? */}
                <div className={pass ? 'reset-img' : 'close-img'} />
                {/* : <div className='close-img'>&times;</div>} */}
              </button>
              <label
                htmlFor={'password-box'}
                id={'password-label'}
                className={'password-label form__label'}
              />
              <input
                className={pass ? 'form__text password' : 'form__input password'}
                id={'password-box'}
                type='text'
                name='password'
                value={formValues.password}
                placeholder='Enter new Password'
                onChange={handlePasswordChange}
                disabled={pass}
              />
              <p className='text-danger'>{isSubmit ? passErrors.password : null}</p>
              {pass ? (
                ''
              ) : (
                <button type='button' className='save-btn' onClick={(e) => handlePassword(e)}>
                  SAVE
                </button>
              )}
            </div>
            {/* {input({
              handleChange,
              errorShow: isSubmit,
              className: 'password',
              value: formValues.password ? formValues.password : '************',
              name: 'password',
              label: 'Password',
              disabled: true,
            })} */}
          </div>
          <div className='profile-footer'>
            {visible ? (
              ''
            ) : (
              <button type='submit' className='save-btn' id='submit-button'>
                SAVE
              </button>
            )}
          </div>
        </Form>
        <button
          type='button'
          title='logout'
          className='logout __section'
          onClick={() => {
            handleHide()
            dispatch(logOut())
          }}
        >
          <div className='__image' />
          {/* <div className='__name'>Logout</div> */}
        </button>
      </Modal.Body>
    </Modal>
  )
}

export default Userprofile
