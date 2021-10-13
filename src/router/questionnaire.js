/*
* 证明
*
*/
const questList = r => require.ensure([], () => r(require('@/pages/staff-self/questionnaire/list.vue')), 'questList') // 问卷调查
export default [
  {
    path : '/questList',
    name : 'questList',
    component : questList
  },
]
