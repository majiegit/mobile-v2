const Leaveoff = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/leaveoff/index')), 'leaveoff')
const LeaveoffNew = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/leaveoff/leavereg')), 'leaveoffnew')

export default [
  {
    path : '/attendance-leave/leaveoff',
    name : 'leaveoff',
    component : Leaveoff
  },
  {
    path : '/attendance-leave/leaveoff/new',
    name : 'leavereg',
    component : LeaveoffNew
  }

]
