import './index.scss'
import { useAppSelector } from '../../Store/type'
import profile from '../../Component/assets/profile.svg'
import { useEffect, useState } from 'react'
export default function Header({ showProfile }: any) {
  const data = useAppSelector((state: any) => state.user.usersProfile?.data)
  const [username, setName] = useState(data?.name)
  const [profileURL, setProfile] = useState(data?.profileUrl)
  useEffect(() => {
    setName(data?.name)
    setProfile(data?.profileUrl)
  }, [data])
  return (
    <div className='header-title'>
      <div className='__logo' />
      <div className='profile __section' onClick={() => showProfile(true)}>
        <div className='__name'>
          <p className='name'>{username}</p>
        </div>
        <div className='__image'>
          <img src={profileURL ? profileURL : profile} height={60} width={60} alt='profile' />
        </div>
      </div>
    </div>
  )
}
