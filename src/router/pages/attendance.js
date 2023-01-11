import attendanceEdit from '@/pages/attendance/edit'
import attendanceDetail from '@/pages/attendance/detail'
import attendanceApprove from '@/pages/attendance/approve'

export default [
    {
        path: '/attendanceEdit',
        name: 'attendanceEdit',
        component: attendanceEdit
    },
    {
        path: '/attendanceDetail',
        name: 'attendanceDetail',
        component: attendanceDetail
    },
    {
        path: '/attendanceApprove',
        name: 'attendanceApprove',
        component: attendanceApprove
    }
]

