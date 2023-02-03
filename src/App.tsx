import '@/App.css'
import styles from './app.less'
// import styles from './app.module.scss'
// import styles from './app.module.styl'

function App() {
  return <div className={styles['app']}>
    <h2>webpack5-react-ts</h2>
    <div className={styles['box']}>box</div>
  </div>
}

export default App


