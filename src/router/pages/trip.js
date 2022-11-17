import tripEdit from '@/pages/trip/edit'
import tripDetail from '@/pages/trip/detail'
import tripApprove from '@/pages/trip/approve'

export default [
    {
        path: '/tripEdit',
        name: 'tripEdit',
        component: tripEdit
    },
    {
        path: '/tripDetail',
        name: 'tripDetail',
        component: tripDetail
    },
    {
        path: '/tripApprove',
        name: 'tripApprove',
        component: tripApprove
    }
]

