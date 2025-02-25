import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import AddUser from './addUser'
import UserDetail from './userDetail'
import './index.scss'
import ReactPaginate from 'react-paginate'
import { useAppDispatch, useAppSelector } from '../../Store/type'
import { fetchclientsList } from '../../Store/Slice/client'
// import next from '../../Component/assets/next.svg'
// import previous from '../../Component/assets/previous.svg'
const itemsPerPage = 10

export default function User() {
  const dispatch = useAppDispatch()
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchclientsList({ pageSize: itemsPerPage, pageCount: 0 }))
  }, [])
  // const pers = useAppSelector((state: any) => state.users?.data)

  const pData = useAppSelector((state: any) => state.clients?.clientList)
  const userdata = pData?.data || []
  const totalLength = pData?.data?.count
  // const [single, setSingle] = useState<any>(true)
  // const [isDelete, setIsDelete] = useState<any>(false)
  const [modal, setModal] = useState<any>('view')
  const [userId, setUserId] = useState<any>('')
  const [userShow, setuserShow] = React.useState<any>(false)
  const [addUserShow, setAddUserShow] = useState<any>(false)

  const [pageCount, setPageCount] = useState<any>(0)
  const [currentPage, setCurrentPage] = useState<any>(0)

  const [disable, isDisable] = React.useState<any>(true)
  useEffect(() => {
    const totalCount = Math.ceil(totalLength / itemsPerPage)
    setPageCount(totalCount)
  }, [totalLength])

  useEffect(() => {
    // log.info(`On page ${currentPage}`);
    dispatch(fetchclientsList({ pageSize: itemsPerPage, pageCount: currentPage }))
  }, [currentPage])
  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected)
  }

  return (
    <div className='user-list'>
      <div className='user-header'>
        <h5
          style={{
            fontWeight: 'bold',
          }}
        >
          User Details
        </h5>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type='button'
            className='add-btn'
            data-toggle='tooltip'
            data-placement='bottom'
            title='Add User'
            onClick={() => {
              // log.info('clicked on add user');
              // setSingle(true)
              setUserId('')
              setAddUserShow(true)
            }}
          >
            +
          </button>
        </div>
      </div>
      <Table className='user-page' hover>
        <thead>
          <tr>
            <th className='th1' aria-label='pi' />
            <th className='th2'>Email</th>
            <th className='th3'>Name</th>
            <th className='th5'>Action</th>
          </tr>
        </thead>
        <tbody>
          {userdata &&
            userdata.map(
              (item: {
                uuid: string
                profileUrl: string
                email: string
                first_name: string
                last_name: string
              }) => (
                <tr key={item.uuid}>
                  <td>
                    {item.profileUrl ? (
                      <img src={item.profileUrl} alt='' />
                    ) : (
                      <img className='image-profile' alt='' />
                    )}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.first_name + ' ' + item.last_name}</td>
                  <td>
                    <div className='actions'>
                      <span
                        aria-hidden
                        className='eyeIcon'
                        onClick={() => {
                          setModal('view')
                          isDisable(true)
                          setuserShow(true)
                          setUserId(item.uuid)
                        }}
                      >
                        view
                      </span>

                      <span
                        aria-hidden
                        className='editIcon'
                        onClick={() => {
                          setModal('view')
                          isDisable(false)
                          setuserShow(true)
                          setUserId(item.uuid)
                        }}
                      >
                        edit
                      </span>
                      <span
                        aria-hidden
                        className='deleteIcon'
                        onClick={() => {
                          setModal('delete')
                          // setIsDelete(false)
                          setuserShow(true)
                          setUserId(item.uuid)
                        }}
                      >
                        delete
                      </span>
                    </div>
                  </td>
                </tr>
              ),
            )}
        </tbody>
        {/* <div> */}
        {userShow && userId && modal === 'view' ? (
          <UserDetail
            show={userShow}
            userId={userId}
            isDisable={disable}
            onHide={() => {
              setuserShow(false)
              setUserId('')
            }}
          />
        ) : null}
        {/* </div> */}
        {/* <div>
        {userShow && userId && !isDelete && modal === 'delete' ? (
          <DeleteConfirmation
            show={userShow}
            userId={userId}
            setIsDelete={setIsDelete}
            onHide={() => {
              setuserShow(false);
            }}
          />
        ) : null}
      </div> */}
        {/* <div> */}
        {addUserShow && userId === '' ? (
          <AddUser
            show={addUserShow}
            onHide={() => {
              setAddUserShow(false)
              setUserId('')
            }}
          />
        ) : null}
        {/* </div> */}
      </Table>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName='pagination'
        activeLinkClassName='activetab'
        activeClassName='active'
        // previousLabel={<img src={previous} alt='upload' />}
        // nextLabel={<img src={next} alt='upload' />}
        breakLabel='...'
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
      />
    </div>
  )
}
