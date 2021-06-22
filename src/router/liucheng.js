/**
 * Created by bicheng on 2018/3/1.
 */
const liuchengZhipei = r => require.ensure([], () => r(require('@/pages/staff-self/liucheng/index')), 'liuchengZhipei')
export default [
    {
      path: '/liucheng-zhipei',
      name: 'liucheng-zhipei',
      component:  liuchengZhipei
    }
]
