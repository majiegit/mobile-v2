import awayoffEdit from '@/pages/awayoff/edit'
import awayoffDetail from '@/pages/awayoff/detail'
import awayoffApprove from '@/pages/awayoff/approve'

export default [
    {
        path: '/awayoffEdit',
        name: 'awayoffEdit',
        component: awayoffEdit
    },
    {
        path: '/awayoffDetail',
        name: 'awayoffDetail',
        component: awayoffDetail
    },
    {
        path: '/awayoffApprove',
        name: 'awayoffApprove',
        component: awayoffApprove
    }
]

