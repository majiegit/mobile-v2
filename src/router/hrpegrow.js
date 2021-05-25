/**
 * Created by bicheng on 2018/3/1.
 */
const hrpeIndex = r => require.ensure([], () => r(require('@/pages/staff-self/hrpegrow/hrpe-index')), 'hrpeIndex')
const growIndex = r => require.ensure([], () => r(require('@/pages/staff-self/hrpegrow/grow-index')), 'growIndex')
export default [
    {
      path: '/hrpe-index',
      name: 'hrpe-index',
      component:  hrpeIndex
    },
    {
      path: '/grow-index',
      name: 'grow-index',
      component : growIndex
    }
]
