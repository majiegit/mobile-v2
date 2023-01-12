import Login from '@/pages/login/login.vue'
import dingSsoLogin from '@/pages/login/dingSsoLogin.vue'

export default	[
  {
    path : '/',
    redirect : 'login',
  },
  {
    path : '/login',
    name: 'login',
    component : Login
  },
  {
    path : '/dingSsoLogin',
    name: 'dingSsoLogin',
    component : dingSsoLogin
  }
]
