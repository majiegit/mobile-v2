const fstep = r => require.ensure([], () => r(require('@/pages/staff-self/transmng/fstep.vue')), 'fsetp')
const trns = r => require.ensure([], () => r(require('@/pages/staff-self/transmng/index.vue')), 'trns')

export default [
  {
    path : '/transmng/fstep',
    name : 'fstep',
    component : fstep
  },
  {
    path : '/transmng/index/:transway/:transtype',
    name : 'trns',
    component : trns
  }
]
