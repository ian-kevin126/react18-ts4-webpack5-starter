import loginLeft from '@/assets/imgs/login_left.png'
import LoginForm from './LoginForm'
import styles from './index.scss'

const Login: React.FC = () => {
  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <div className={styles['login-left']}>
          <img src={loginLeft} alt='login' />
        </div>
        <div className={styles['login-right']}>
          <div className={styles['login-logo']}>
            <span className={styles['login-text']}>East_White_Admin</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login
