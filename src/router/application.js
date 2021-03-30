/*
 *Created by yangyang11 on 2017/8/17.
 *
 */
import App from '../App'
import Hello from '../components/Hello.vue'
import Application from '@/pages/index/home/home.vue'
import Login from '@/pages/index/login/login.vue'
import Todo from '@/pages/index/home/todo.vue'
import Frame from '@/pages/index/frame/frame.vue'
// import Test from '../pages/test/test.vue'
import vuexDemo from '@/store/demo/vuexDemo'
import SsoLogin from '@/pages/index/login/ssoLogin.vue'  //用于客户单点登录用，请勿删除
import SpaceSsoLogin from '@/pages/index/login/spaceSsoLogin.vue'  //用于客户单点登录用，请勿删除 针对友空间

export default	[
  // 动态路径参数 以冒号开头
  {
    path : '/',
    redirect : 'login',
  },


  {
    path:'/application',
    name: 'application',
    component: Application,
  },


  {
    path : '/login',
    name: 'login',
    component : Login
  },
  {
      path : '/ssoLogin',
      name: 'ssoLogin',
      component : SsoLogin
  },
  {
      path : '/spaceSsoLogin',
      name: 'spaceSsoLogin',
      component : SpaceSsoLogin
  },

  {
    path : '/todo',
    name: 'todo',
    component : Todo,
  },
  {
    path : '/frame',
    name: 'frame',
    component : Frame,
  },
  {
    path: '/vuexDemo',
    component: vuexDemo
  },
  // {
  //   path : '/test',
  //   component : Test,
  // },

  // { path: '/',

  //   component: App,
  //   name : "app",
  //   children:[

  //   ]
  // },

]
