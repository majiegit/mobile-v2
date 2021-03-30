const Awayoff = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/awayoff/index')), 'Awayoff')
const AwayoffNew = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/awayoff/awayreg')), 'Awayoffnew')
export default [
  {
    path : '/attendance-leave/awayoff',
    name : 'awayoff',
    component : Awayoff
  },
  {
    path : '/attendance-leave/awayoff/new',
    name : 'awayreg',
    component : AwayoffNew
  }
]
