import transEdit from '@/pages/trans/edit'
import transDetail from '@/pages/trans/detail'
import transApprove from '@/pages/trans/approve'

export default [
    {
        path: '/transEdit',
        name: 'transEdit',
        component: transEdit
    },
    {
        path: '/transDetail',
        name: 'transDetail',
        component: transDetail
    },
    {
        path: '/transApprove',
        name: 'transApprove',
        component: transApprove
    }
]

