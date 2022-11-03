import overtimeEdit from '@/pages/overtime/edit'
import overtimeDetail from '@/pages/overtime/detail'
import overtimeApprove from '@/pages/overtime/approve'

export default [
  {
    path: '/overtimeEdit',
    name: 'overtimeEdit',
    component: overtimeEdit
  },
  {
    path: '/overtimeDetail',
    name: 'overtimeDetail',
    component: overtimeDetail
  },
  {
    path: '/overtimeApprove',
    name: 'overtimeApprove',
    component: overtimeApprove
  }
]

