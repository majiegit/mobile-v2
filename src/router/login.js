import Login from '@/pages/login/login.vue'

export default	[
  {
    path : '/',
    redirect : 'login',
  },
  {
    path : '/login',
    name: 'login',
    component : Login
  }
]
