import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { captchaApi, loginApi } from '@/api/base'

const reducers = {
  // 将生成的 reducer 添加为特定的顶级切片
  [captchaApi.reducerPath]: captchaApi.reducer,
  [loginApi.reducerPath]: loginApi.reducer
}

const combinedReducer = combineReducers<typeof reducers>(reducers)

const store = configureStore({
  reducer: combinedReducer,
  // 添加api中间件可以实现缓存、无效化、轮询和其他`rtk-query'的有用功能。
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      // }
    }).concat([captchaApi.middleware, loginApi.middleware])
})

// https://www.toptal.com/react/redux-toolkit-and-rtk-query
// https://github.dev/gdagundaridze/rtk-query-toptal-example
// 可选的，但对于refetchOnFocus/refetchOnReconnect行为是必需的。见`setupListeners`文档 -- 需要一个可选的回调作为第二参数，以便进行自定义。
setupListeners(store.dispatch)

// export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof combinedReducer>
export const useTypedDispatch = () => useDispatch<AppDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
