

const AttendanceInfo = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/attendanceInfo/index')), 'attendanceInfo')
const BillDetail = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/attendanceInfo/components/bill-detail')), 'billdetail')

export default [
    {
        path : '/attendance-leave/attendanceInfo',
        name : 'attendanceInfo',
        component : AttendanceInfo
    },
    {
      path : '/attendance-leave/attendanceInfo/billDetail',
      name : 'billdetail',
      component : BillDetail
    }

]
