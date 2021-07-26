/**
 * Created by bicheng on 2018/3/1.
 */
const indexOne = r => require.ensure([], () => r(require('@/pages/images/index')), 'indexOne')
const indexTwo = r => require.ensure([], () => r(require('@/pages/images/index2')), 'indexTwo')
const index4 = r => require.ensure([], () => r(require('@/pages/images/index4')), 'index4')
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
    },
  ,
  {
    path: '/index-4',
    name: 'index-4',
    component : index4
  }
]
