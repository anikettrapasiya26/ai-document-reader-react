import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import './index.scss'
import { Form, Button } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import { sendImage, uploadDocs } from '../../Store/Slice/doc'
import FileViewer from 'react-file-viewer'
import html2canvas from 'html2canvas'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import LoadingSpinner from '../../Component/LoadingSpinner/Loading'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

const UploadDoc = (props: any) => {
  const {
    setIsDisable,
    setMultifile,
    multifile,
    setMultifileView,
    dropzoneRef,
    setPreview,
    setnewDoc,
    fileType,
    type,
    setActive,
    setCommon,
    setFileType,
    common,
    setType,
    setSelectfileID,
    multifileView,
    isDisabled,
  } = props
  const dispatch = useAppDispatch()
  const store = useAppSelector((state: any) => state.docs?.docs)
  const successMessage = store?.success
  const errorMessage = store?.error
  const [file, setFile] = useState<any>(null)
  const [imgs, setImg] = useState<any>([])
  const [prev, setPrev] = useState(false)
  const [multiImage, setMultiImage] = useState<any>([])
  const [submit, IsSubmit] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [error, isError] = useState<boolean>(true)
  const [large, setLarge] = useState<any>(null)
  const [size, setSize] = useState<number>(0)
  const [ind, SetInd] = useState<any>('')
  const [numPages, setNumPages] = useState(null)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }
  const im = React.useRef<any>(null)

  useEffect(() => {
    im.current?.scrollIntoView({ Top: 0, behavior: 'smooth' })
  })
  useEffect(() => {
    im.current.scrollIntoView({ Top: 0, behavior: 'smooth' })
  }, [common])

  const handleDrop = (acceptedFiles: File[]) => {
    setErrorMsg('')
    setFileType('')
    IsSubmit(false)
    setFile(acceptedFiles[0])

    acceptedFiles.map((files: any) => {
      if (size > 30000000 || files.size > 30000000) {
        setErrorMsg('can not upload file more than 30mb')
        setFile('')
      } else if (
        type === 'image' &&
        !(files.type === 'image/png' || files.type === 'image/jpeg' || files.type === 'image/jpg')
      ) {
        setErrorMsg('You can only upload images')
      } else {
        setPreview(false)
        setActive(true);
        setSize(size + files.size)
        const reader = new FileReader()

        reader.onload = () => {
          setSelectfileID(files.name)
          const img: any = new Image()
          img.onload = () => {
            html2canvas(img).then((canvas: any) => {
              console.log(canvas)
            })
          }
          if (
            multiImage?.length > 9 ||
            imgs?.length > 9 ||
            multifile?.length > 9 ||
            acceptedFiles.length > 9
          ) {
            setErrorMsg('You can not Upload More than ten document')
          } else if (files.type === 'application/pdf') {
            setMultifile(acceptedFiles)
            setPrev(true)
            setCommon({
              name: files.name,
              type: 'pdf',
              url: reader.result,
            })
            setType('pdf')
            setMultifileView((prevState: any) => {
              return [...prevState, { name: files.name, url: reader.result, type: 'pdf' }]
            })
          } else if (files.type === 'application/msword') {
            setMultifile(acceptedFiles)
            setPrev(true)
            setType('doc')
            setCommon({
              name: files.name,
              type: 'docx',
              url: reader.result,
            })
            setMultifileView((prevState: any) => {
              return [...prevState, { name: files.name, url: reader.result, type: 'docx' }]
            })
          } else if (
            files.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) {
            setMultifile(acceptedFiles)
            setPrev(true)
            setType('docx')
            setCommon({
              name: files.name,
              type: 'docx',
              url: reader.result,
            })
            setMultifileView((prevState: any) => {
              return [...prevState, { name: files.name, url: reader.result, type: 'docx' }]
            })
          } else if (
            files.type === 'image/jpeg' ||
            files.type === 'image/png' ||
            files.type === 'image/jpg'
          ) {
            setType('image')
            setImg((url: string | any[]) => url.concat(files as any))
            setMultiImage((url: string | any[]) => url.concat(reader.result as string))
            setMultifileView((prevState: any) => {
              return [...prevState, { name: files.name, url: reader.result, type: 'image' }]
            })
            setLarge(reader.result)
            SetInd(reader.result)
            setPrev(true)
          } else {
            // setMultifileView([ ...multifileView, {
            //   name: '',
            //   type: '',
            //   url: '',
            // } ])
            // setErrorMsg(`${files.type} is not supported.`)
            setErrorMsg('Please Upload valid pdf, photos or doc format')
            setType('')
            setPrev(false)
          }
        }
        reader.readAsDataURL(files)
      }
    })
  }

  const handleOnSubmit = async (event: any) => {
    event.preventDefault()
    setIsDisable(true)
    isError(true)
    setErrorMsg('Please! Upload file')

    try {
      if (file) {
        IsSubmit(true)
        const formData = new FormData()
        if (imgs && type === 'image') {
          for (const key of Object.keys(imgs)) {
            formData.append('files', imgs[key])
          }
          dispatch(sendImage(formData))
        }
        if (multifile && type !== 'image') {
          for (const key of Object.keys(multifile)) {
            formData.append('files', multifile[key])
          }
          dispatch(uploadDocs(formData))
        }
        setnewDoc(true)
        setErrorMsg('')
        setLarge('')
      } else IsSubmit(false)
    } catch (error: any) {
      error.response && setErrorMsg(error.response.data)
    }
  }

  // const handleRemoveImage = (e: any) => {
  //   const array = [...multiImage] // make a separate copy of the array
  //   const index = array.indexOf(e)
  //   if (index !== -1) {
  //     array.splice(index, 1)
  //     setMultiImage(array)
  //   }
  // }

  useEffect(() => {
    if (successMessage && submit) {
      setIsDisable(false)
      setPreview(true)
      setActive(false)
      setImg([])
    }
  }, [successMessage, submit])

  useEffect(() => {
    if ((errorMessage && submit) || store === 'Internal Server Error') {
      IsSubmit(false)
      isError(false)
      setPrev(false)
      setType('')
    }
  }, [errorMessage, store, submit])
  const onError = (e: any) => {
    setErrorMsg(e)
  }

  return (
    <div id='upload'>
      <div id={'im'} ref={im}></div>
      {submit && isDisabled && error && <LoadingSpinner show={submit} />}
      <div style={{ display: prev ? 'none' : 'unset' }}>
        <div className='head'>
          <h1>Add Document</h1>
        </div>
        <Form className='search-form' onSubmit={handleOnSubmit}>
          <div className='upload-section'>
            <Dropzone onDrop={handleDrop} ref={dropzoneRef}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: 'drop-zone' })}>
                  <input {...getInputProps()} />
                  <div
                    title='Drag and drop a file OR click here to select a file'
                    className='upload-img'
                  />
                </div>
              )}
            </Dropzone>
          </div>
        </Form>
      </div>
      {prev && (
        <>
          {common.url && type !== 'doc' && type !== 'image' && (
            <div className='prev-file'>
              {fileType === 'application/pdf' || common.type === 'application/pdf' ? (
                <>
                  {/* <iframe style={{ width: '100%', height: '347px', borderRadius: '7px' }} src={common.url}></iframe> */}
                  <Document file={common.url} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                  {/* <p>
                    Page {pageNumber} of {numPages}
                  </p> */}
                  {/* <object data={common.url} type='application/pdf' width='100%' height='100%'>
                   <p>
                     Alternative text - include a link <a href={common.url}>to the PDF!</a>
                   </p>
                  </object> */}
                </>
              ) : (fileType ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                common.url) ||
                fileType === 'application/msword' ? (
                <DocViewer
                  documents={[{ uri: common.url, fileType: common.type }]}
                  pluginRenderers={DocViewerRenderers}
                />
              ) : (
                common.url && (
                  <FileViewer
                    style={{ width: '100%' }}
                    key={common.url}
                    className='file-viewer-style'
                    fileType={common.type}
                    filePath={common.url}
                    // fileContent={common.url}
                    onError={onError}
                  />
                )
              )}
            </div>
          )}
          {type === 'doc' && (
            <div className='prev-file'>
              <p className='doc-error'>
                Preview Not Availble for this File
                <br />
                Please Submit file to Preview
              </p>
            </div>
          )}
          {large && !submit && (
            <div className='lrg'>
              <img src={large} alt='preview' />
            </div>
          )}

          <div className='image' style={{ display: type !== 'image' ? 'none' : 'flex' }}>
            {type === 'image' &&
              !submit &&
              multifileView &&
              multiImage &&
              multifileView.map((item: { url: string | undefined }, index: number) => (
                <div key={index} className='multi-img'>
                  {/* <button
                      type='button'
                      onClick={() => handleRemoveImage(item)}
                      className='close close-btn'
                    >
                      &times;
                    </button> */}
                  <img
                    className='sample-img'
                    src={item.url}
                    style={{
                      border: item.url === ind ? '1px solid' : 'none',
                    }}
                    onClick={() => {
                      setLarge(item.url)
                      SetInd(item.url)
                      im.current.scrollIntoView({ Top: 0, behavior: 'smooth' })
                    }}
                  />
                </div>
              ))}
            {type === 'image' && !submit && (
              <div className='preview'>
                <Button
                  className='prev-image'
                  title='Add Image'
                  onClick={() => dropzoneRef?.current.open()}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      {/* <div className='multi-files'>
        {!newDoc &&
          multifile?.map((item: any, index: number) => (
            <button
              key={index}
              // title={item.name}
              type='button'
              style={{
                backgroundColor: '#000',
                color: '#fff',
              }}
              onClick={() => {
                // setFileType(item?.type)
                // setSelectID(index)
                setUrl(url)
              }}
            >
              {item.name}
            </button>
          ))}
      </div> */}
      {errorMsg && <p className='errorMsg'>{errorMsg}</p>}

      {!submit && (
        <div className='submit-button'>
          <Button className='sub-btn' variant='primary' onClick={handleOnSubmit} type='submit'>
            Submit
          </Button>
        </div>
      )}
    </div>
  )
}

export default UploadDoc
