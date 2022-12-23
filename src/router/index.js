import storage from 'store'
import {USERINFO, TOKEN_TIME_EXP, ACCESS_TOKEN, REFRESH_TOKEN} from '@/utils/mutation-types'
import {queryPsndocInfo, queryUserRoleMenu} from '@/api/home'
import Vue from 'vue'
import Router from 'vue-router'
import {AllRouterList} from './router.config'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(Router)


const router = new Router({
  mode: 'hash',
  routes: AllRouterList,
  base: './'
})

const allowList = ['login', 'inductionInfo','qrCode']  // no redirect allowList
const loginRoutePath = '/login'
const defaultRoutePath = '/application'


router.beforeEach((to, from, next) => {
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    // 如果有token 情况下
    if (to.path === loginRoutePath) {
      next({path: defaultRoutePath})
    } else {
      if (storage.get(USERINFO) == undefined || storage.get(USERINFO) == null) {
        queryPsndocInfo().then(res => {
          storage.set(USERINFO, res.data)
          let params = {
            status: 1,
            menu_type: 1
          }
            // 请求带有 redirect 重定向时，登录自动重定向到该地址
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // set the replace: true so the navigation will not leave a history record
              next({...to, replace: true})
            } else {
              // 跳转到目的路由
              next({path: redirect})
            }
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token 情况下
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      // 不在免登陆名单下，跳转登录地址，携带重定向访问地址
      next({path: loginRoutePath, query: {redirect: to.fullPath}})
    }
  }
})

router.afterEach(() => {
})


export default router

