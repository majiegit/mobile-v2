import dimissionEdit from '@/pages/dimission/edit'
import dimissionDetail from '@/pages/dimission/detail'
import dimissionApprove from '@/pages/dimission/approve'

export default [
    {
        path: '/dimissionEdit',
        name: 'dimissionEdit',
        component: dimissionEdit
    },
    {
        path: '/dimissionDetail',
        name: 'dimissionDetail',
        component: dimissionDetail
    },
    {
        path: '/dimissionApprove',
        name: 'dimissionApprove',
        component: dimissionApprove
    }
]

