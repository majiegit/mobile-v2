import Personal from '@/pages/personal/personal.vue'
import PersonalEdit from '@/pages/personal/personalEdit.vue'
import personalSubEdit from '@/pages/personal/subEdit.vue'
import personalSubList from '@/pages/personal/subList.vue'

export default [
  {
    path: '/personal',
    name: 'personal',
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
  }
]
