import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Dashboard from './Dashboard'
import { PersistGate } from 'redux-persist/integration/react'
import Header from '../Component/Header'
import './index.scss'
// import User from './User'
import Profile from './Profile'
import { useAppSelector, useAppDispatch } from '../Store/type'
import { persistor } from '../Store/reducer'
import { logOut } from '../Store/Slice/auth'
import { toast } from 'react-toastify'
import { restoreDocState } from '../Store/Slice/doc'
import { fetchUsersProfile } from '../Store/Slice/user'

function Pages() {
  const dispatch = useAppDispatch()
  const userDetail = useAppSelector((state: any) => state.userDetails.user?.data)
  useEffect(() => {
    dispatch(fetchUsersProfile())
  }, [])
  const [open, setOpen] = useState<boolean>(true)

  const [showProfile, setShowProfile] = useState(false)

  window.addEventListener('resize', () => {
    if (document.body.clientWidth < 500) {
      setOpen(false)
    } else setOpen(true)
  })
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(restoreDocState())
  }, [])

  useEffect(() => {
    if (!userDetail?.token) {
      dispatch(logOut())
      navigate('/')
      console.count('1')
      toast.info('User Logout successfully')
    }
  }, [userDetail])
  return (
    <PersistGate loading={null} persistor={persistor}>
      <div className={`main ${open ? 'open' : ''} dark`}>
        <div className='head_container'>
          <Header title={'hii'} showProfile={setShowProfile} />
        </div>
        {showProfile && <Profile show={setShowProfile} onHide={() => setShowProfile(false)} />}
        <div className='content'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            {/* <Route path='/user' element={<User />} /> */}
          </Routes>
        </div>
      </div>
    </PersistGate>
  )
}
export default Pages
