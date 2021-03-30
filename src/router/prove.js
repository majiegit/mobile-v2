
/*
 *Created by yangyang11 on 2017/8/17.
 *
 */

const Prove = r => require.ensure([], () => r(require('@/pages/staff-self/prove/prove.vue')), 'prove')
const UserList = r => require.ensure([], () => r(require('@/pages/staff-self/prove/components/approver-list.vue')), 'UserList')
export default [
      { 
        name: 'prove',
        path : '/prove',
        component : Prove 
      },
      { 
        name: 'proveUserList',
        path : '/prove/proveUserList',
        component : UserList 
      }
]

