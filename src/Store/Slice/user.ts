import { createSlice } from '@reduxjs/toolkit'
import api, { profileApi } from '../../api/index'
import { toast } from 'react-toastify'

// Slice

const slice = createSlice({
  name: 'usersProfile',
  initialState: {
    usersProfile: {},
    updateProfile: {},
    resetPassword: {},
  },
  reducers: {
    restoreUserState(state: any) {
      state.usersProfile = {}
      state.updateProfile = {}
      state.resetPassword = {}
    },
    usersProfileSuccess: (state: any, action) => {
      state.usersProfile = action.payload
      state.usersProfile.isLoading = false
    },
    usersProfileRequest: (state: any) => {
      state.usersProfile = {}
      state.usersProfile.isLoading = true
    },
    updateProfileSuccess: (state: any, action) => {
      state.updateProfile = action.payload
      state.updateProfile.isLoading = false
    },
    updateProfileRequest: (state: any) => {
      state.updateProfile = {}
      state.updateProfile.isLoading = true
    },
    updateProfileError: (state: any, action) => {
      state.updateProfile = action.payload
      state.updateProfile.isLoading = false
    },
    resetPasswordSuccess: (state: any, action) => {
      state.resetPassword = action.payload
      state.resetPassword.isLoading = false
    },
    resetPasswordRequest: (state: any) => {
      state.resetPassword = {}
      state.resetPassword.isLoading = true
    },
    resetPasswordError: (state: any, action) => {
      state.resetPassword = action.payload
      state.resetPassword.isLoading = false
    },
  },
})

export default slice.reducer

// Actions

export const {
  restoreUserState,
  usersProfileRequest,
  usersProfileSuccess,
  updateProfileSuccess,
  updateProfileRequest,
  resetPasswordSuccess,
  resetPasswordRequest,
  resetPasswordError,
} = slice.actions

export const fetchUsersProfile =
  () => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
    restoreUserState()
    dispatch(usersProfileRequest({}))
    try {
      await api
        .post('user/detail')
        .then((response: { data: any }) => dispatch(usersProfileSuccess(response.data)))
        .catch((error) => {
          toast.error(
            error.response && error.response.data.error.message
              ? error.response.data.error.message
              : error.message,
          )
        })
    } catch (e: any) {
      toast.error(e.message ? e.message : e)
      return console.error(e.message)
    }
  }
export const updateProfile = (profileData: any) => async (dispatch: any) => {
  restoreUserState()
  dispatch(updateProfileRequest({}))
  try {
    await profileApi
      .put('user/update_profile', profileData)
      .then(
        (response: { data: any }) => (
          dispatch(updateProfileSuccess(response.data)),
          toast.success(response.data.message),
          dispatch(fetchUsersProfile())
        ),
      )
      .catch((error) => {
        dispatch(updateProfileSuccess(error.response)),
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
  (resetPasswordData: { newPassword: string }) =>
    async (dispatch: (arg0: { payload: any; type: any }) => any) => {
      restoreUserState()
      dispatch(resetPasswordRequest({}))
      try {
        await api
          .put('password/reset_password', resetPasswordData)
          .then((response: { data: any }) => {
            dispatch(resetPasswordSuccess(response.data)), toast.success(response.data.message)
          })
          .catch((error) => {
            dispatch(resetPasswordError(error.response)),
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
