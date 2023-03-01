export function watchEnv(env: string) {
  const num = Math.ceil(Math.random() * 10)
  if (num < 5) {
    env = 'development'
  }
  return env === 'production' ? '生产环境' : '测试开发环境'
}

export function add(a: number, b: number) {
  return a + b
}
