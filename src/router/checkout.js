const checkout = r => require.ensure([], () => r(require('@/pages/staff-self/checkout/index.vue')), 'checkout')
const uploadfield = r => require.ensure([], () => r(require('@/pages/staff-self/checkout/components/subpages/uploadField')), 'uploadfield')
const fielddetail = r => require.ensure([], () => r(require('@/pages/staff-self/checkout/components/subpages/fielddetail')), 'fielddetail')
const reloadLocation = r => require.ensure([], () => r(require('@/pages/staff-self/checkout/components/subpages/reloadLocation')), 'reloadLocation')

export default [
  {
    path : '/checkout',
    name : 'checkout',
    component : checkout
  },
  {
    path : '/uploadfield',
    name : 'uploadfield',
    component : uploadfield
  },
  {
    path : '/fielddetail',
    name : 'fielddetail',
    component : fielddetail
  },
  {
    path : '/reloadLocation',
    name : 'reloadLocation',
    component : reloadLocation
  }
]
