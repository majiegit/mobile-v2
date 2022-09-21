import Vue from 'vue'
import Router from 'vue-router'
import login from './login'
import home from './home'
import personal from './personal'
Router.prototype.goBack = function () {
　　this.isBack = true
　　window.history.go(-1)
}

const routeArr = [].concat(
  login,
  personal,
  home,

)
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: routeArr,
  base: './'
})
export default router

