import awayEdit from '@/pages/away/edit'
import awayDetail from '@/pages/away/detail'
import awayApprove from '@/pages/away/approve'

export default [
    {
        path: '/awayEdit',
        name: 'awayEdit',
        component: awayEdit
    },
    {
        path: '/awayDetail',
        name: 'awayDetail',
        component: awayDetail
    },
    {
        path: '/awayApprove',
        name: 'awayApprove',
        component: awayApprove
    }
]

