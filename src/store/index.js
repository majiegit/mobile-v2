/**
 * Created by yangyang11 on 2017/11/3.
 * 
 */

import Vue from 'vue';
import Vuex from 'vuex';
import action from './action'
import mutations from './mutations'
import vuexDemo from './modules/demo/index'
Vue.use(Vuex)

// 根store
const store = new Vuex.Store({
  // 根store的state
  state: {
  	text: '我是根store'
  },

  // store的计算属性 类似vue组件的computed
  getters: {
   	rootGetters(state, getters){
       console.log('getters已执行')
      	return state.text +='getters已执行';
  	}
  },

  // 根store的actions
  actions: action,

  // mutations
  mutations: mutations,

  // 子模块
  modules: {
    vuexDemo: vuexDemo,
  },
})

export default store

/**
 * 如需使用vuex  敬请移步 https://vuex.vuejs.org/zh-cn/intro.html
 * 
 */