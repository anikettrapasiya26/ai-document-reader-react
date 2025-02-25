import React, { useState, useEffect, useRef } from 'react'
import Message from '../Message/Message'
import './Messenger.scss'
import UploadDoc from '../../Pages/Document/upload'
import { useAppSelector } from '../../Store/type'
import LoadingSpinner from '../LoadingSpinner/Loading'
import { rasaApi } from '../../api/index'

const Messenger = () => {
  const [msg, setMsg] = useState('')
  const [multifile, setMultifile] = useState<any>(null)
  const [multifileView, setMultifileView] = useState<any>([])
  // const [singleFile, setSingleFile] = useState<any>(null)
  const [multifilekey, setmultifileKey] = useState<any>('')
  const [isLoading, setisLoading] = useState<boolean>(false)
  const [type, setType] = useState('')
  const [fileType, setFileType] = useState<any>('')
  const [preview, setPreview] = useState<boolean>(false)
  const [newDoc, setnewDoc] = useState<boolean>(false)
  const store = useAppSelector((state: any) => state.docs?.docs?.data)
  const preserveDoc = useAppSelector(
    (state: { docs: { preserveDoc: any } }) => state.docs.preserveDoc,
  )

  const userData = useAppSelector((state: any) => state.user.usersProfile?.data)
  const userName = userData?.name
  const successMessage = store?.success
  const [selectId, setSelectId] = useState<any>(0)
  const [selectfileID, setSelectfileID] = useState<any>(0)
  const [buttonText, setButtonText] = useState('')
  const [disable, setIsDisable] = useState(true)
  const [msgRef, setmsgRef] = useState('')
  const [common, setCommon] = useState<any>({
    name: '',
    type: '',
    url: '',
  })
  const [firstAppearance, setFirstAppear] = useState(true)
  const [active, setActive] = useState(true)
  const buttonList: any = [
    { id: 1, title: 'Keywords Extraction' },
    { id: 2, title: 'Clause Extraction' },
    { id: 3, title: 'Contract Summarization' },
    { id: 4, title: 'Name Entity Recognition' },
  ]

  useEffect(() => {
    setCommon({
      type: preserveDoc[0]?.type,
      name: preserveDoc[0]?.name,
      url: preserveDoc[0]?.fileurl,
    })
    setFileType(preserveDoc[0]?.type)
    setSelectfileID(0)
    if (preserveDoc[0]?.type === 'application/pdf') {
      setType('')
    }
    setMultifileView([])
  }, [preserveDoc])
  const [userdata, setuserdata] = useState<{ fullname: string; email: string; photo: string }>({
    fullname: '',
    email: '',
    photo: '',
  })
  useEffect(() => {
    setmsgRef(buttonText)
  }, [buttonText])
  const [msgArray, setMsgArray] = useState<any>([])
  useEffect(() => {
    // console.log("____________________")
    // console.log(msg)
    // console.log(firstAppearance)
    // console.log("____________________")

    try {
      if (firstAppearance || msg === '') {
        // const token: any = localStorage.getItem('token')
        // const { decodedToken, isExpired } = useJwt(token)
        // // const result: any = jwt.verify(token, 'this is key')
        setuserdata({
          ...userdata,
          fullname: userData?.name,
          email: userData?.email,
          photo: userData?.profileUrl,
        })
        setFirstAppear(!firstAppearance)
      } else {
        sendMessage()
      }
    } catch (error) {
      console.error(error)
    }
  }, [msg])
  useEffect(() => {
    setMultifile(preserveDoc)
    setmultifileKey(store?.[0]?.key)
  }, [store])
  const topRef = useRef<any>(null)
  const el = useRef<any>(null)

  useEffect(() => {
    el.current?.scrollIntoView({ behavior: 'smooth' })
  })
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [multifile])
  const onEnterkeyhandler = (e: any) => {
    if (e.key === 'Enter') {
      setMsg(msgRef)
      setmsgRef('')
      setFirstAppear(false)
    }
  }

  const dropzoneRef = React.useRef<any>(null)
  const submitBtnHandler = () => {
    setMsg(msgRef)
    setmsgRef('')
    setFirstAppear(false)
  }

  const sendMessage = async () => {
    setSelectId('')
    setTimeout(() => {
      setMsgArray((previousState: any) => [
        ...previousState,
        {
          message: msgRef,
          msgOwner: true,
        },
      ])
    }, 200)

    if (fileType || type) {
      const multifilekeys: any = []

      for (let keys = 0; keys < store.length; keys++) {
        multifilekeys.push(store[keys].key)
      }

      const newtext = multifilekeys.toString().substring(0, multifilekeys.toString().length - 0)
      const replcetext = newtext.replace(/"/g, '')

      setisLoading(true)

      await rasaApi
        .post('/webhooks/rest/webhook', {
          message: `${msgRef} | ${type === 'image' ? replcetext : multifilekey}`,
          sender: userdata.email,
        })
        .then((res) => {
          setPreview(true)
          setisLoading(false)
          return res.data
        })
        .then((res) => {
          setMsg('')

          if (res.length > 0) {
            res.map((valueObj: any) => {
              if ('recipient_id' in valueObj) {
                return setMsgArray((previousState: any) => [
                  ...previousState,
                  {
                    message: valueObj.text,
                    msgOwner: false,
                    recipient_id: valueObj.recipient_id,
                  },
                ])
              } else {
                let text = valueObj.text
                let newtext = ''
                if (text.charAt(0) == '[') {
                  newtext = text.substring(1, text.length - 1)
                  // console.log(newtext)
                  const newarray = newtext.split('\n')
                  text = newarray.join('   ####  ')
                }
                return setMsgArray((previousState: any) => [
                  ...previousState,
                  {
                    message: text,
                    msgOwner: false,
                  },
                ])
              }
            })
          } else {
            console.log(res)
            setisLoading(false)
          }
        })
        .catch((err) => {
          setisLoading(false)
          console.log(err)
        })
    }
  }

  const handelColor = (list: { id: number }) => {
    setSelectId(list.id)
  }

  return (
    <div className='messenger'>
      <div className='chatBox'>
        {isLoading && <LoadingSpinner show={isLoading} />}
        <div className='chatBoxWrapper'>
          <div className='chatBoxTop'>
            <div id={'top'} ref={topRef} className='heading'>
              <UploadDoc
                setIsDisable={setIsDisable}
                successMessage={successMessage}
                multifile={multifile}
                setMultifile={setMultifile}
                // singleFile={singleFile}
                setType={setType}
                isDisabled={disable}
                dropzoneRef={dropzoneRef}
                setMultifileView={setMultifileView}
                fileType={fileType}
                setFileType={setFileType}
                setPreview={setPreview}
                multifileView={multifileView}
                type={type}
                setActive={setActive}
                setCommon={setCommon}
                common={common}
                setnewDoc={setnewDoc}
                setSelectfileID={setSelectfileID}
              />
            </div>
            {msgArray.map((messageDetails: any) => (
              <>
                <Message
                  key={messageDetails.recipient_id}
                  ownerName={userName}
                  recipient_id={messageDetails.recipient_id}
                  own={messageDetails.msgOwner}
                  msgToDisplay={messageDetails.message}
                  setMsg={setMsg}
                  sendMessage={submitBtnHandler}
                  photo={userdata.photo}
                />
                <div id={'el'} ref={el}></div>
              </>
            ))}
          </div>
          <div>
            {type === 'image' ? (
              ''
            ) : (
              <div className='multi-files'>
                {multifile?.length > 0 && preview
                  ? newDoc &&
                  multifile?.map(
                    (
                      item: { name: string; key: string; fileurl: string; type: any },
                      index: number,
                    ) => (
                      <a key={index} className='top' href='#top'>
                        <button
                          title={item.name}
                          type='button'
                          style={{
                            backgroundColor: index === selectfileID ? '#000' : '#fff',
                            color: index === selectfileID ? '#fff' : '#000',
                          }}
                          onClick={() => {
                            topRef.current.scrollIntoView({ Top: 0, behavior: 'smooth' })
                            setFileType(item.type)
                            setCommon({
                              type:
                                item.type ===
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                  ? 'docx'
                                  : item.type,
                              name: item.name,
                              url: item.fileurl,
                            })
                            setType(item.type)
                            setSelectfileID(index)
                            // setSingleFile(item.fileurl)
                            setmultifileKey(item.key)
                          }}
                        >
                          {item.name}
                        </button>
                      </a>
                    ),
                  )
                  : multifileView?.map((item: any, index: number) => (
                    <a key={index} className='top' href='#top'>
                      <button
                        key={index}
                        title={item.name}
                        type='button'
                        style={{
                          backgroundColor: item.name === selectfileID ? '#000' : '#fff',
                          color: item.name === selectfileID ? '#fff' : '#000',
                        }}
                        onClick={() => {
                          setFileType(item?.type)
                          // setType(item?.type)
                          setSelectfileID(item.name)
                          // setSingleFile(item.url)
                          setCommon({
                            type: item?.type,
                            name: item.name,
                            url: item.url,
                          })
                        }}
                      >
                        {item.name}
                      </button>
                    </a>
                  ))}
              </div>
            )}
            <div className='multi-extraction'>
              {buttonList &&
                buttonList.map((item: { id: number; title: string }) => (
                  <button
                    disabled={active}
                    key={item.id}
                    type='button'
                    style={{
                      backgroundColor: item.id === selectId ? '#000' : '#fff',
                      color: item.id === selectId ? '#fff' : '#000',
                    }}
                    onClick={() => {
                      handelColor(item)
                      setActive(false)
                      setButtonText(item.title)
                    }}
                  >
                    {item.title}
                  </button>
                ))}
            </div>
            <div className='chatBoxBottom'>
              <input
                className='inputTextArea chatMessageInput'
                value={msgRef}
                onClick={(e) => {
                  onEnterkeyhandler(e)
                }}
                onChange={(e) => {
                  setmsgRef(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }}
                placeholder='Type Message'
                disabled={disable || active}
              ></input>
              <div>
                <a className='top' href='#top'>
                  <button
                    className='chatSubmitButton'
                    type='submit'
                    onClick={() => {
                      setActive(true)
                      setButtonText('')
                      setSelectId('')
                      // window.scrollTo({ top: 0, behavior: 'smooth' })
                      topRef.current.scrollIntoView({ behavior: 'smooth' })
                      dropzoneRef?.current.open()
                    }}
                    disabled={disable}
                  >
                    <img className='chat-pint-btn' />
                  </button>
                </a>
                <button
                  className='chatSubmitButton'
                  onClick={sendMessage}
                  type='submit'
                  disabled={disable || active}
                >
                  <img className='chat-submit-btn' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messenger
