import { useState } from 'react'
import '@/App.css'
import lessStyles from '@/app.less'
import scssStyles from '@/app.module.scss'
import stylStyles from '@/app.module.styl'
import smallImg from '@/assets/imgs/5kb_img.jpeg'
import bigImg from '@/assets/imgs/10kb_img.png'
import chengzi from '@/assets/imgs/chengzi.png'
import memberList from './test.json'
import ClassComp from '@/components/Class'
import { Demo1, Demo2 } from '@/components'
import {watchEnv, add} from '@/utils/watch'

function App() {
  const [ count, setCounts ] = useState('')
  const onChange = (e: any) => {
    setCounts(e.target.value)
  }
  console.log('memberList', memberList)

  return <div>
    <h2>webpack5-react-ts</h2>
    <div className={lessStyles['lessBox']}>
      <div className={lessStyles['box']}>lessBox（east_white）
      <img src={smallImg} alt="小于10kb的图片" />
      <img src={bigImg} alt="大于于10kb的图片" />
      <img src={chengzi} alt="橙子font" />
      <div className={lessStyles['smallImg']}>小图片背景</div> 
      <div className={lessStyles['bigImg']}>大图片背景</div> 
      </div>
    </div>
    <div className={scssStyles['scssBox']}>
      <div className={scssStyles['box']}>scssBox</div>
    </div>
    <div className={stylStyles['stylBox']}>
      <div className={stylStyles['box']}>stylBox</div>
    </div>
    <ClassComp />
    <div>
        <p>受控组件</p>
        <input type="text" value={count} onChange={onChange} />
        <br />
        <p>非受控组件</p>
        <input type="text" />
    </div>
    <Demo1 />
    <div>{add(1, 2)}</div>
  </div>
}

export default App


