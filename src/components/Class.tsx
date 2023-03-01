import { PureComponent } from 'react'

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 2222
}

// 使用装饰器
@addAge
class ClassComp extends PureComponent {
  age?: number

  render() {
    return <h2>我是类组件---{this.age}</h2>
  }
}

export default ClassComp
