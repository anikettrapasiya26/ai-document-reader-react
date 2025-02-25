import React, { useState, useEffect } from 'react'
// import moment from 'moment/moment';
import { Button, Form } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'

// import { userEdit, userView } from '../../Stores/Action';
import input from '../../Component/Form/input'
import { editUser, fetchclientsDetails } from '../../Store/Slice/client'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import './index.scss'

export default function UserDetail(props: {
  userId: string
  isDisable: boolean
  onHide: any
  show: boolean
}) {
  const dispatch = useAppDispatch()
  const { userId, isDisable, onHide } = props

  useEffect(() => {
    dispatch(fetchclientsDetails(userId))
  }, [])

  const userState = useAppSelector((state: any) => state.clients?.clients)
  const data = userState?.data || {}

  const [preview, setpreview] = useState()

  const [profileimage, setprofileimage] = useState<any>('')
  useEffect(() => {
    setprofileimage(data?.profile_url)
  }, [profileimage])

  useEffect(() => {
    data?.profile_url ? setpreview(profileimage) : setpreview(undefined)
  }, [profileimage])

  const [formValues, setFormValues] = useState<any>({})
  const [formErrors, setFormErrors] = useState<any>({})
  const [isSubmit, setIsSubmit] = useState(false)
  useEffect(() => {
    setFormValues({
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
      phone: data?.phone,
    })
  }, [data])
  const uploadSingleFile = async () => {
    const formData = new FormData()
    formData.append('first_name', formValues.first_name)
    formData.append('last_name', formValues.last_name)
    formData.append('phone', formValues.phone)
    formData.append('userId', userId)
    await dispatch(editUser(formData))
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      uploadSingleFile()
    }
  }, [formErrors])

  const validate = (values: { first_name: string; last_name: string; phone: string }) => {
    const errors: any = {}
    const Name = /^[A-Za-z ]*$/
    const Phone = /^(([1-9]{2,4})[ -]*)*?[0-9]{3,6}?[ -]*[0-9]{3,6}?$/

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

    if (!values.phone) {
      errors.phone = 'Phone is required'
    } else if (values.phone.length < 10) {
      errors.phone = 'Phone cannot exceed less than 10 characters'
    } else if (values.phone.length > 10) {
      errors.phone = ' Phone number is not correct'
    } else if (!Phone.test(values.phone)) {
      errors.phone = 'This is not a valid Phone number'
    }
    return errors
  }
  const handleHide = async () => {
    setFormErrors(false)
    onHide()
    setIsSubmit(false)
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmit(true)
    setFormErrors(validate(formValues))
  }

  const ImageAvailable = (
    <Image
      className='in-image'
      style={{ height: '82px', width: '82px', borderRadius: '50%' }}
      crossOrigin='anonymous'
      src={preview}
      alt='Update preview'
    />
  )
  const notProfile = <div className='__image' />

  const profilePhoto = preview ? ImageAvailable : notProfile

  return (
    <div onClick={() => handleHide()} className='profile_section'>
      <div onClick={(e) => e.stopPropagation()} className='wrap'>
        <Form
          method='POST'
          id='UserDetail'
          className='user-modal'
          onSubmit={handleSubmit}
          style={{ paddingBottom: '10px' }}
        >
          <div className='userHeader'>
            <h2
              style={{
                fontWeight: 'bolder',
                color: 'GrayText',
              }}
            >
              User Details
            </h2>
          </div>

          {profilePhoto && (
            <div className='profile-image' style={{ display: 'flex', justifyContent: 'center' }}>
              <label htmlFor='photo-upload' className='___image'>
                <div>{profilePhoto}</div>
              </label>
            </div>
          )}

          {input({
            handleChange,
            errorShow: isSubmit,
            value: formValues.first_name,
            errors: formErrors.first_name,
            name: 'first_name',
            label: 'First Name',
            disabled: isDisable,
            maxLength: 50,
          })}

          {input({
            handleChange,
            errorShow: isSubmit,
            value: formValues.last_name,
            errors: formErrors.last_name,
            name: 'last_name',
            label: 'Last Name',
            disabled: isDisable,
            maxLength: 50,
          })}

          {input({
            handleChange,
            errorShow: isSubmit,
            value: formValues.email,
            name: 'email',
            label: 'Email',
            disabled: true,
          })}

          {input({
            handleChange,
            errorShow: isSubmit,
            value: formValues.phone,
            errors: formErrors.phone,
            name: 'phone',
            label: 'Phone Number',
            disabled: isDisable,
            maxLength: 10,
          })}
          {!isDisable && (
            <div className='profileFooter'>
              <Button
                className='submitButton'
                type='submit'
                id='submit-button'
                style={{ marginBottom: '10px' }}
              >
                SAVE
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}
