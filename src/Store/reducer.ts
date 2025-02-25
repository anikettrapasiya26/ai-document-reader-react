import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import thunk from 'redux-thunk'

import { persistStore, persistReducer, PERSIST, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Infer the `RootState` and `AppDispatch` types from the store itself
import user from './Slice/user'
import docs from './Slice/doc'
import userDetails from './Slice/auth'
import clients from './Slice/client'
const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineReducers({
  userDetails,
  user,
  docs,
  clients,
})
// const initialValue = {
//   userDetails: {
//     user: {},
//     forgot: {},
//     otp: {},
//     reset: {},
//   },
//   user: {
//     usersProfile: {},
//     updateProfile: {},
//   },
//   docs: {
//     docs: {},
//   },
// }
const middlewares = [thunk]
const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  // preloadedState: initialValue,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REGISTER],
      },
    }).concat(middlewares),
})

// initStateWithPrevTab(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)
export default store
