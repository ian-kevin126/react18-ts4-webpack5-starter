import '@/App.css'
import styles from './app.module.less'

function App() {
  return <div className={styles['app']}>
    <h2>webpack5-react-ts</h2>
    <div className={styles['box']}>box</div>
  </div>
}

export default App


