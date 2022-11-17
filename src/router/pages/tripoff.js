import tripoffEdit from '@/pages/tripoff/edit'
import tripoffDetail from '@/pages/tripoff/detail'
import tripoffApprove from '@/pages/tripoff/approve'

export default [
  {
    path: '/tripoffEdit',
    name: 'tripoffEdit',
    component: tripoffEdit
  },
  {
    path: '/tripoffDetail',
    name: 'tripoffDetail',
    component: tripoffDetail
  },
  {
    path: '/tripoffApprove',
    name: 'tripoffApprove',
    component: tripoffApprove
  }
]

