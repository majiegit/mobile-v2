import Home from '@/pages/home/home.vue'
import updatePassword from '@/pages/home/component/updatePassword.vue'

export default	[
  {
    path : '/application',
    name: 'application',
    component : Home
  },
  {
    path : '/updatePassword',
    name: 'updatePassword',
    component : updatePassword
  }
]
