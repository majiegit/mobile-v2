import leaveoffEdit from '@/pages/leaveoff/edit'
import leaveoReg from '@/pages/leaveoff/leavereg'
import leaveoffDetail from '@/pages/leaveoff/detail'
import leaveoffApprove from '@/pages/leaveoff/approve'

export default [
    {
        path: '/leaveoffEdit',
        name: 'leaveoffEdit',
        component: leaveoffEdit
    },
    {
        path: '/leaveoffDetail',
        name: 'leaveoffDetail',
        component: leaveoffDetail
    },
    {
        path: '/leaveoffApprove',
        name: 'leaveoffApprove',
        component: leaveoffApprove
    },
  {
    path: '/leaveoReg',
    name: 'leaveoReg',
    component: leaveoReg
  }
]

