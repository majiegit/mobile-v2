import staffQuery from '@/pages/staffQuery/index'
import staffQueryDetail from '@/pages/staffQuery/detail'
import staffQueryList from '@/pages/staffQuery/list'
export default [
  {
    path: '/staffQuery',
    name: 'staffQuery',
    component: staffQuery
  },
  {
    path: '/staffQueryDetail',
    name: 'staffQueryDetail',
    component: staffQueryDetail
  },
  {
    path: '/staffQueryList',
    name: 'staffQueryList',
    component: staffQueryList
  }
]

