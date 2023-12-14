// 引用 Mock
import Mock from 'mockjs'

Mock.mock('http://localhost:8859/info', {
  data: [],
  code: 200,
  message: 'ok',
})
