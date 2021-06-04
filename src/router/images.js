/**
 * Created by bicheng on 2018/3/1.
 */
const indexOne = r => require.ensure([], () => r(require('@/pages/images/index')), 'indexOne')
const indexTwo = r => require.ensure([], () => r(require('@/pages/images/index2')), 'indexTwo')
export default [
    {
      path: '/index-one',
      name: 'index-one',
      component:  indexOne
    },
    {
      path: '/index-Two',
      name: 'index-Two',
      component : indexTwo
    }
]
