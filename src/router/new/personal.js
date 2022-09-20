/*
 *Created by zhanghua on 2017/9/04.
 *
 */

const Personal = r => require.ensure([], () => r(require('@/pages/new/personal/personal.vue')), 'personal')
const personalSubEdit = r => require.ensure([], () => r(require('@/pages/new/personal/subEdit.vue')), 'personalSubEdit')
const PersonalEdit = r => require.ensure([], () => r(require('@/pages/new/personal/personalEdit.vue')), 'personalEdit')
const personalSubList = r => require.ensure([], () => r(require('@/pages/new/personal/subList.vue')), 'personalSubList')
const personalEnclosure = r => require.ensure([], () => r(require('@/pages/new/personal/components/enclosure.vue')), 'personalEnclosure')
export default [
  {
    path: '/personalNew',
    name: 'personalNew',
    component: Personal
  },
  {
    path: '/personalEdit',
    name: 'personalEdit',
    component: PersonalEdit
  },
  {
    path: '/personalSubList',
    name: 'personalSubList',
    component: personalSubList
  },
  {
    path: '/personalSubEdit',
    name: 'personalSubEdit',
    component: personalSubEdit
  },
  {
    path: '/personalEnclosure',
    name: 'personalEnclosure',
    component: personalEnclosure
  }
]
