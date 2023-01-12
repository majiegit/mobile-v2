import regEdit from '@/pages/reg/edit'
import regDetail from '@/pages/reg/detail'
import regApprove from '@/pages/reg/approve'

export default [
  {
    path: '/regEdit',
    name: 'regEdit',
    component: regEdit
  },
  {
    path: '/regDetail',
    name: 'regDetail',
    component: regDetail
  },
  {
    path: '/regApprove',
    name: 'regApprove',
    component: regApprove
  }
]

