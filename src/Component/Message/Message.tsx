import './Message.scss'
import profile from '../../Component/assets/profile.svg'
import botimg from '../../Component/assets/botimg.svg'

const Message = ({
  own,
  msgToDisplay,
  recipient_id,
  ownerName,
  // setMsg,
  // sendMessage,
  photo,
}: any) => {
  return (
    <>
      <div className={own ? 'botImage own' : 'botImage user'}>
        <img className='messageImg' src={own ? photo || profile : botimg} alt='' />
      </div>
      <div className={own ? 'message own' : 'message user'}>
        <div className='chatbutton'>{own ? ownerName : 'Explain AIBot'}</div>

        <div className={own ? 'messageTop own' : 'messageTop user'}>
          {own ? (
            <b>{recipient_id}</b>
          ) : (
            <i>
              <b>@{ownerName}</b>
              <br />
            </i>
          )}

          <p className='co1 messageText'>{msgToDisplay}</p>
        </div>
      </div>
    </>
  )
}

export default Message
