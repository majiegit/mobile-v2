/*
 *Created by zhanghua on 2017/9/04.
 *
 */

const Personal = r => require.ensure([], () => r(require('@/pages/staff-self/personalInfo/personal.vue')), 'personal')
const Editpage = r => require.ensure([], () => r(require('@/pages/staff-self/personalInfo/editpage.vue')), 'editpage')
const Editlist = r => require.ensure([], () => r(require('@/pages/staff-self/personalInfo/editlist.vue')), 'editlist')
const Personalstaff = r => require.ensure([], () => r(require('@/pages/staff-self/personalInfo/personalstaff.vue')), 'personalstaff')
const Fjmanage = r => require.ensure([], () => r(require('@/pages/staff-self/personalInfo/fjmanage.vue')), 'fjmanage')
export default [

    {
        path : '/personal',
        name : 'personal',
        component : Personal
    },
    {
        path : '/editpage',
        name : 'editpage',
        component : Editpage
    },
    {
        path : '/editlist',
        name : 'editlist',
        component : Editlist
    },
    {
        path : '/personalstaff',
        name : 'personalstaff',
        component : Personalstaff
    },
  {
        path : '/fjmanage',
        name : 'fjmanage',
        component : Fjmanage
    },
]
