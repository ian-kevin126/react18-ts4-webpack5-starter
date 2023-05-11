import { useRoutes, Navigate } from 'react-router-dom'
import { RouteObject } from './types'
import Login from '@/pages/System/login'

export const rootRooter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/login' />
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      requireAuth: false,
      title: '登录页',
      key: 'LOGIN'
    }
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  }
]

const Router = () => useRoutes(rootRooter)

export default Router
