import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore } from '@reduxjs/toolkit'
import { captchaApi, loginApi } from '@/api/base'

const store = configureStore({
  reducer: {
    // 将生成的 reducer 添加为特定的顶级切片
    [captchaApi.reducerPath]: captchaApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer
  },
  // 添加api中间件可以实现缓存、无效化、轮询和其他`rtk-query'的有用功能。
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(captchaApi.middleware, loginApi.middleware)
})

// 可选的，但对于refetchOnFocus/refetchOnReconnect行为是必需的。见`setupListeners`文档 -- 需要一个可选的回调作为第二参数，以便进行自定义。
setupListeners(store.dispatch)

export default store
