import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Login } from '@/types/base'
import { ResultData } from '@/types'

export const captchaApi = createApi({
  reducerPath: 'captchaApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/base' }),
  tagTypes: ['Captcha'],
  endpoints: build => ({
    getCaptcha: build.mutation<ResultData<Login.Captcha>, undefined>({
      query(body) {
        return {
          url: `/captcha`,
          method: 'POST',
          body
        }
      }
    })
  })
})

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/base' }),
  tagTypes: ['Login'],
  endpoints: build => ({
    login: build.mutation<ResultData<Login.ResLogin>, Login.ReqLoginForm>({
      query(body) {
        return {
          url: `/login`,
          method: 'POST',
          body
        }
      }
    })
  })
})

export const { useGetCaptchaMutation } = captchaApi
export const { useLoginMutation } = loginApi
