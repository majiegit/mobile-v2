const dimission = r => require.ensure([], () => r(require('@/pages/staff-self/dimissionmsg/index.vue')), 'dimission')

export default [
  {
    path : '/dimissionmng/index',
    name : 'dimission',
    component : dimission
  }
]
