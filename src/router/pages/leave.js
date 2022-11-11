import leaveEdit from '@/pages/leave/edit'
import leaveDetail from '@/pages/leave/detail'
import leaveApprove from '@/pages/leave/approve'

export default [
    {
        path: '/leaveEdit',
        name: 'leaveEdit',
        component: leaveEdit
    },
    {
        path: '/leaveDetail',
        name: 'leaveDetail',
        component: leaveDetail
    },
    {
        path: '/leaveApprove',
        name: 'leaveApprove',
        component: leaveApprove
    }
]

