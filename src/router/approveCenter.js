const approveCenter = r => require.ensure([], () => r(require('@/pages/leader-self/approveCenter/index.vue')), 'approveCenter')
const overtimeapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/overtime/children/overtimeApprove.vue')), 'overtimeapprove')
const awayapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/away/children/awayApprove.vue')), 'awayapprove')
const leaveapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/leave/children/leaveApprove.vue')), 'leaveapprove')
const signcardapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/signcard/children/signcardapprove.vue')), 'signcardapprove')
const awayoffapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/awayoff/children/awayoffApprove.vue')), 'awayoffapprove')
const leaveoffapprove = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/leaveoff/children/leaveoffApprove.vue')), 'leaveoffapprove')
const regapprove = r => require.ensure([], () => r(require('@/pages/staff-self/regmng/children/regApprove.vue')), 'regapprove')
const trnsapprove = r => require.ensure([], () => r(require('@/pages/staff-self/transmng/children/trnsApprove.vue')), 'trnsapprove')
const demissionapprove = r => require.ensure([], () => r(require('@/pages/staff-self/dimissionmsg/children/demissionApprove.vue')), 'demissionapprove')

export default [
  {
    path : '/approveCenter',
    name : 'approveCenter',
    component : approveCenter
  },
  {
    path : '/demissionapprove',
    name : 'demissionapprove',
    component : demissionapprove
  },
  {
    path : '/overtimeapprove',
    name : 'overtimeapprove',
    component : overtimeapprove
  },
  {
    path : '/awayapprove',
    name : 'awayapprove',
    component : awayapprove
  },
  {
    path : '/leaveapprove',
    name : 'leaveapprove',
    component : leaveapprove
  },
  {
    path : '/awayoffapprove',
    name : 'awayoffapprove',
    component : awayoffapprove
  },
  {
    path : '/leaveoffapprove',
    name : 'leaveoffapprove',
    component : leaveoffapprove
  },
  {
    path : '/signcardapprove',
    name : 'signcardapprove',
    component : signcardapprove
  },
  {
    path : '/regapprove',
    name : 'regapprove',
    component : regapprove
  },
  {
    path : '/trnsapprove',
    name : 'trnsapprove',
    component : trnsapprove
  }

]
