export namespace Login {
  export interface Captcha {
    captchaId?: string
    picPath?: string
    captchaLength?: number
    openCaptcha?: boolean
  }

  export interface ReqLoginForm {
    captcha: string
    captchaId?: string
    password: string
    username: string
  }

  export interface ResLogin {
    user: User
    token: string
    expiresAt: number
  }
}

interface User {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  uuid: string
  userName: string
  nickName: string
  sideMode: string
  headerImg: string
  baseColor: string
  activeColor: string
  authorityId: number
  authority: Authority
  authorities: any[]
  phone: string
  email: string
  enable: number
}

interface Authority {
  CreatedAt: string
  UpdatedAt: string
  DeletedAt?: any
  authorityId: number
  authorityName: string
  parentId?: any
  dataAuthorityId?: any
  children?: any
  menus?: any
  defaultRouter: string
}
