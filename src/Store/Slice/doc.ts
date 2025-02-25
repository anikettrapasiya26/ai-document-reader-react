import { createSlice } from '@reduxjs/toolkit'
import { docApi } from '../../api/index'
import { toast } from 'react-toastify'

// Slice

const slice = createSlice({
  name: 'docs',
  initialState: {
    docs: {},
    preserveDoc: [],
  },
  reducers: {
    restoreDocState(state: any) {
      state.docs = {}
      state.preserveDoc = []
      state.isLoading = false
    },
    docsSuccess: (state: any, action) => {
      state.docs = action.payload
      state.docs.isLoading = false
    },
    docsRequest: (state: any) => {
      state.docs = {}
      state.docs.isLoading = true
    },
    docsError: (state: any, action) => {
      state.docs = action.payload
      state.docs.isLoading = false
    },
    preserveDocsSuccess: (state: any, action) => {
      const newData = action.payload?.data
      state.preserveDoc = [...state.preserveDoc, ...newData]
      state.preserveDoc.isLoading = false
    },
    preserveDocsRequest: (state: any) => {
      state.preserveDoc = [...state.preserveDoc]
      state.preserveDoc.isLoading = true
    },
  },
})

export default slice.reducer

export const {
  restoreDocState,
  docsSuccess,
  preserveDocsSuccess,
  docsRequest,
  docsError,
  preserveDocsRequest,
} = slice.actions
export const uploadDocs =
  (uploadData: any) => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(docsRequest({}))
    dispatch(preserveDocsRequest({}))
    try {
      await docApi
        .post('upload/upload', uploadData)
        .then((response: { data: any }) => {
          dispatch(docsSuccess(response.data))
          dispatch(preserveDocsSuccess(response.data))
          toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(docsError(error.response.data))
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      return console.error(e.message)
    }
  }

export const sendImage =
  (uploadData: any) => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(docsRequest({}))
    dispatch(preserveDocsRequest({}))
    try {
      await docApi
        .post('upload/image', uploadData)
        .then((response: { data: any }) => {
          dispatch(docsSuccess(response.data))
          dispatch(preserveDocsSuccess(response.data))
          toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(docsError(error.response.data))
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      return console.error(e.message)
    }
  }
