import Vue from 'vue'
import Router from 'vue-router'
import login from './login'
import home from './home'
// import personal from './personal'
// import myApply from './my-apply'
// import approveCenter from './approveCenter'
// import salary from './salary'
// import reg from './reg'
Router.prototype.goBack = function () {
　　this.isBack = true
　　window.history.go(-1)
}

const routeArr = [].concat(
  login,
  // personal,
  home
  // myApply,
  // salary,
  // reg,
  // approveCenter

)
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: routeArr,
  base: './'
})
export default router

