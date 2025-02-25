import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/index'
import { toast } from 'react-toastify'
import { restoreDocState } from './doc'
import { restoreUserState } from './user'
import { restoreClientState } from './client'
// Slice

const slice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    forgot: {},
    otp: {},
    reset: {},
  },
  reducers: {
    restoreState(state: any) {
      state.user = {}
      state.forgot = {}
      state.otp = {}
      state.reset = {}
    },
    userSuccess: (state: any, action) => {
      state.user = action.payload
      state.isLoading = false
    },
    userRequest: (state: any) => {
      state.user = {}
      state.user.isLoading = true
    },
    userError: (state: any, action) => {
      state.user = action.payload
      state.user.isLoading = false
    },
    forgotSuccess: (state: any, action) => {
      state.forgot = action.payload
      state.forgot.isLoading = false
    },
    forgotRequest: (state: any) => {
      state.forgot = {}
      state.forgot.isLoading = true
    },
    forgotError: (state: any, action) => {
      state.forgot = action.payload
      state.forgot.isLoading = false
    },
    otpSuccess: (state: any, action) => {
      state.otp = action.payload
      state.otp.isLoading = false
    },
    otpRequest: (state: any) => {
      state.otp = {}
      state.otp.isLoading = true
    },
    otpError: (state: any, action) => {
      state.otp = action.payload
      state.otp.isLoading = false
    },
    resetPasswordSuccess: (state: any, action) => {
      state.reset = action.payload
      state.reset.isLoading = false
    },
    resetPasswordRequest: (state: any) => {
      state.reset = {}
      state.reset.isLoading = true
    },
    resetPasswordError: (state: any, action) => {
      state.reset = action.payload
      state.reset.isLoading = false
    },
  },
})

export default slice.reducer

// Actions

const {
  restoreState,
  userSuccess,
  userRequest,
  userError,
  forgotSuccess,
  forgotRequest,
  forgotError,
  resetPasswordSuccess,
  resetPasswordError,
  resetPasswordRequest,
  otpSuccess,
  otpRequest,
  otpError,
} = slice.actions

export const signIn =
  (signinData: any) => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(userRequest({}))
    try {
      await api
        .post('auth/signin', signinData)
        .then((response: { data: any }) => {
          dispatch(userSuccess(response.data))
          toast.success(response.data.message)
          localStorage.setItem('accessToken', response.data.data.token)
        })
        .catch((error) => {
          dispatch(userError(error.response))
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

export const signUp =
  (signupData: any) => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(userRequest({}))
    try {
      await api
        .post('auth/signup', signupData)
        .then((response: { data: any }) => {
          dispatch(userSuccess(response.data))
          toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(userError(error.response))
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

export const forgotPassword =
  (forgotData: { email: string }) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(forgotRequest({}))
    try {
      await api
        .post('auth/forget', forgotData)
        .then((response: { data: any }) => {
          dispatch(forgotSuccess(response.data)), toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(forgotError(error.response))

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

export const OTP =
  (otp: { otp: string; email: string }) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(otpRequest({}))
    try {
      await api
        .put('auth/verify', otp)
        .then((response: { data: any }) => {
          dispatch(otpSuccess(response.data)), toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(otpError(error.response))

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
export const newPassword =
  (changePasswordData: { email: string; newPassword: string }) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    dispatch(resetPasswordRequest({}))
    try {
      await api
        .put('auth/newPassword', {
          email: changePasswordData.email,
          newPassword: changePasswordData.newPassword,
        })
        .then((response: { data: any }) => {
          dispatch(resetPasswordSuccess(response.data)), toast.success(response.data.message)
        })
        .catch((error) => {
          dispatch(resetPasswordError(error.response))
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
export const logOut = () => async (dispatch: any) => {
  try {
    dispatch(userSuccess({ type: 'user/userSuccess' }))
    localStorage.removeItem('accessToken')
    dispatch(restoreState())
    dispatch(restoreDocState())
    dispatch(restoreUserState())
    dispatch(restoreClientState())
  } catch (e: any) {
    return console.error(e.message)
  }
}
