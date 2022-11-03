import signcardEdit from '@/pages/signcard/edit'
import signcardDetail from '@/pages/signcard/detail'
import signcardApprove from '@/pages/signcard/approve'

export default [
    {
        path: '/signcardEdit',
        name: 'signcardEdit',
        component: signcardEdit
    },
    {
        path: '/signcardDetail',
        name: 'signcardDetail',
        component: signcardDetail
    },
    {
        path: '/signcardApprove',
        name: 'signcardApprove',
        component: signcardApprove
    }
]

