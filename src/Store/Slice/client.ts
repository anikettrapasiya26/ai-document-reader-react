import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/index'
import { toast } from 'react-toastify'

// Slice

const slice = createSlice({
  name: 'clients',
  initialState: {
    clients: {},
    clientList: [],
  },
  reducers: {
    restoreClientState(state: any) {
      state.clients = {}
      state.clientList = {}
      state.isLoading = false
    },
    clientsSuccess: (state: any, action) => {
      state.clients = action.payload
      state.isLoading = false
    },
    clientList: (state: any, action) => {
      state.clientList = action.payload
      state.isLoading = false
    },
  },
})

export default slice.reducer

// Actions

export const { restoreClientState, clientsSuccess, clientList } = slice.actions

export const fetchclientsList =
  (page: { pageCount: number; pageSize: number }) =>
  async (dispatch: (arg0: { payload: any; type: 'clients/clientList' }) => any) => {
    try {
      await api
        .get(`client/clientList?pageSize=${page.pageSize}&pageCount=${page.pageCount}`)
        .then((response: { data: any }) => {
          dispatch(clientList({ type: 'clients/clientList', payload: response.data })),
            toast.success(response.data.message)
        })
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message)
      return console.error(e.message)
    }
  }
export const addUser =
  (userData: any) =>
  async (dispatch: (arg0: { payload: any; type: 'clients/clientsSuccess' }) => any) => {
    try {
      await api
        .post('client/addClient', userData)
        .then((response: { data: any }) => {
          dispatch(clientsSuccess({ type: 'clients/clientsSuccess', payload: response.data })),
            toast.success(response.data.message)
          fetchclientsList({ pageCount: 0, pageSize: 10 })
        })
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message)
      return console.error(e.message)
    }
  }
export const fetchclientsDetails = (userId: string) => async (dispatch: any) => {
  try {
    await api
      .get(`client/clientDetail?userId=${userId}`)
      .then((response: { data: any }) => {
        dispatch(clientsSuccess({ type: 'clients/clientsSuccess', payload: response.data })),
          toast.success(response.data.message)
      })
      .catch((error) => {
        toast.error(
          error.response && error.response.data.error.message
            ? error.response.data.error.message
            : error.message,
        )
      })
  } catch (e: any) {
    toast.error(e.message)
    return console.error(e.message)
  }
}
export const editUser =
  (userData: any) =>
  async (dispatch: (arg0: { payload: any; type: 'clients/clientsSuccess' }) => any) => {
    try {
      await api
        .put('client/updateClient', userData)
        .then((response: { data: any }) => {
          dispatch(clientsSuccess({ type: 'clients/clientsSuccess', payload: response.data })),
            toast.success(response.data.message)
          fetchclientsList({ pageCount: 0, pageSize: 10 })
        })
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message)
      return console.error(e.message)
    }
  }

export const deleteUser =
  (clientId: string) =>
  async (dispatch: (arg0: { payload: any; type: 'clients/clientList' }) => any) => {
    try {
      await api
        .delete(`client/deleteClient?userId=${clientId}`)
        .then((response: { data: any }) => {
          dispatch(clientList({ type: 'clients/clientList', payload: response.data })),
            toast.success(response.data.message)
          fetchclientsList({ pageCount: 0, pageSize: 10 })
        })
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message)
      return console.error(e.message)
    }
  }

export const resetPassword =
  (resetData: string) =>
  async (dispatch: (arg0: { payload: any; type: 'clients/clientList' }) => any) => {
    try {
      await api
        .post('client/resetPassword', resetData)
        .then((response: { data: any }) => {
          dispatch(clientList({ type: 'clients/clientList', payload: response.data })),
            toast.success(response.data.message)
        })
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message)
      return console.error(e.message)
    }
  }
